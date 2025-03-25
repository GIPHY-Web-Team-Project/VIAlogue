import { ref, push, update, remove, onValue, get } from 'firebase/database';
import { db } from '../config/firebase-config';

/**
 * Retrieves messages for a specific chat by its ID and invokes a callback with the messages.
 *
 * @async
 * @function getMessagesByChatId
 * @param {string} chatId - The ID of the chat to retrieve messages for.
 * @param {function(Array): void} callback - A callback function that is invoked with an array of messages.
 *                                           If no messages are found, the callback is invoked with an empty array.
 * @returns {void}
 *
 * @example
 * getMessagesByChatId('chat123', (messages) => {
 *     console.log(messages);
 * });
 */
export const getMessagesByChatId = async (chatId, callback) => {
  const chatMessagesRef = ref(db, `chats/${chatId}/messages`);

  onValue(chatMessagesRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const messageIds = Object.keys(snapshot.val());
    const messages = [];

    for (const messageId of messageIds) {
      const messageRef = ref(db, `messages/${messageId}`);
      await new Promise((resolve) => {
        onValue(
          messageRef,
          (msgSnapshot) => {
            if (msgSnapshot.exists()) {
              messages.push(msgSnapshot.val());
            }
            resolve();
          },
          { onlyOnce: true }
        );
      });
    }

    callback(messages);
  });
};

/**
 * Adds a new message to the database and updates the corresponding chat's message list.
 *
 * @async
 * @function
 * @param {string} chatId - The ID of the chat to which the message belongs.
 * @param {string} message - The content of the message.
 * @param {string} sender - The ID or name of the sender of the message.
 * @param {string} [gifUrl=""] - Optional URL of a GIF associated with the message.
 * @returns {Promise<void>} A promise that resolves when the message and chat updates are complete.
 */
export const addMessage = async (chatId, message, sender, gifUrl = '') => {
  const chatRef = ref(db, `chats/${chatId}`);

  const chatSnapshot = await get(chatRef);
  if (!chatSnapshot.exists()) return;

  const chatData = chatSnapshot.val();
  const unreadBy = chatData.users.filter((user) => user !== sender);

  const newMessage = {
    chatId,
    message,
    createdOn: new Date().toString(),
    sender,
    gifUrl,
    reactions: {},
    unreadBy,
  };
  const result = await push(ref(db, `messages`), newMessage);
  const id = result.key;
  await update(ref(db, `messages/${id}`), { id });
  await update(ref(db, `chats/${chatId}/messages/${id}`), { [id]: true });
};

/**
 * Deletes a message from the database.
 *
 * This function removes a message from both the `messages` collection
 * and the corresponding `messages` entry in the specified chat.
 *
 * @async
 * @function deleteMessage
 * @param {string} chatId - The ID of the chat containing the message.
 * @param {string} messageId - The ID of the message to be deleted.
 * @returns {Promise<void>} A promise that resolves when the message is deleted.
 */
export const deleteMessage = async (chatId, messageId) => {
  await remove(ref(db, `messages/${messageId}`));
  await remove(ref(db, `chats/${chatId}/messages/${messageId}`));
};

/**
 * Updates a specific message in both the messages and chats database references.
 *
 * @async
 * @function updateMessage
 * @param {string} chatId - The ID of the chat containing the message.
 * @param {string} messageId - The ID of the message to be updated.
 * @param {string} updatedMessage - The new content or value to update the message with.
 * @param {string} element - The specific field or property of the message to be updated.
 * @returns {Promise<void>} Resolves when the message is successfully updated.
 * @throws {Error} Logs an error if the update operation fails.
 */
export const updateMessage = async (chatId, messageId, updatedMessage, element) => {
  try {
    await update(ref(db, `messages/${messageId}`), { [element]: updatedMessage });
    await update(ref(db, `chats/${chatId}/messages/${messageId}`), { [element]: updatedMessage });
    console.log('Message updated successfully!');
  } catch (error) {
    console.error('Error updating message:', error);
  }
};

export const markMessagesAsRead = async (chatId, username) => {
  const chatMessagesRef = ref(db, `chats/${chatId}/messages`);

  const chatMessagesSnapshot = await get(chatMessagesRef);
  if (!chatMessagesSnapshot.exists()) return;

  const messageIds = Object.keys(chatMessagesSnapshot.val());

  const updates = {};
  for (const messageId of messageIds) {
    const messageRef = ref(db, `messages/${messageId}`);
    const messageSnapshot = await get(messageRef);
    if (messageSnapshot.exists()) {
      const messageData = messageSnapshot.val();
      if (messageData.unreadBy?.includes(username)) {
        updates[`messages/${messageId}/unreadBy`] = messageData.unreadBy.filter((user) => user !== username);
      }
    }
  }

  await update(ref(db), updates);
};

export const getMessageById = async (messageId) => {
  const messageRef = ref(db, `messages/${messageId}`);
  onValue(messageRef, (snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });
  return messageRef;
};
