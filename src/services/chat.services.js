import { db } from '../config/firebase-config';
import { ref, push, onValue, update, get } from 'firebase/database';
import { getMessageById } from './message.services';

/**
 * Retrieves chats associated with a specific username, including additional metadata such as
 * the latest message and unread message count for each chat. The chats are sorted by the
 * timestamp of the latest message in descending order.
 *
 * @async
 * @function
 * @param {string} username - The username to filter chats by.
 * @param {function(Array): void} callback - A callback function that receives the updated list of chats.
 * Each chat object includes the following properties:
 *   - `users` (Array<string>): The users participating in the chat.
 *   - `isDeleted` (boolean): Indicates if the chat is deleted.
 *   - `latestMessage` (Object|null): The most recent message in the chat, or null if no messages exist.
 *   - `unreadCount` (number): The count of unread messages for the given username.
 * @returns {function(): void} - A function to unsubscribe from the real-time database listener.
 */

export const getChatsByUsername = async (username, callback) => {
  const chatsRef = ref(db, 'chats');

  const unsubscribe = onValue(chatsRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const chatsData = snapshot.val();
    const filteredChats = Object.values(chatsData).filter((chat) => chat.users.includes(username) && !chat.isDeleted);

    const chatPromises = filteredChats.map(async (chat) => {
      let unreadCount = 0;
      let latestMessage = null;

      if (chat.messages) {
        const messageIds = Object.keys(chat.messages);
        for (const messageId of messageIds) {
          const messageRef = ref(db, `messages/${messageId}`);
          const messageSnapshot = await get(messageRef);
          if (messageSnapshot.exists()) {
            const messageData = messageSnapshot.val();
            if (!latestMessage || new Date(messageData.createdOn) > new Date(latestMessage.createdOn)) {
              latestMessage = messageData;
            }
            if (messageData.unreadBy?.includes(username)) {
              unreadCount++;
            }
          }
        }
      }

      chat.latestMessage = latestMessage;
      chat.unreadCount = unreadCount;
      return chat;
    });

    const updatedChats = await Promise.all(chatPromises);

    updatedChats.sort((a, b) => {
      if (!a.latestMessage && !b.latestMessage) return 0;
      if (!a.latestMessage) return 1;
      if (!b.latestMessage) return -1;

      return new Date(b.latestMessage.createdOn) - new Date(a.latestMessage.createdOn);
    });

    callback(updatedChats);
  });

  return unsubscribe;
};

/**
 * Retrieves a chat by its ID and listens for real-time updates.
 *
 * @async
 * @function getChatById
 * @param {string} chatId - The unique identifier of the chat to retrieve.
 * @param {function} callback - A callback function to handle the chat data.
 *                              Receives an array of chat messages if the chat exists,
 *                              or `null` if the chat does not exist.
 * @returns {Promise<function>} A promise that resolves to an unsubscribe function
 *                              to stop listening for real-time updates.
 */
export const getChatById = (chatId, callback) => {
  const chatRef = ref(db, `chats/${chatId}`);

  const unsubscribe = onValue(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });

  return unsubscribe;
};

/**
 * Creates a new chat with the specified users and title, and executes a callback with the chat ID.
 *
 * @async
 * @function
 * @param {Array<string>} users - An array of user IDs to include in the chat.
 * @param {string} [title=''] - The title of the chat (optional, defaults to an empty string).
 * @param {Function} callback - A callback function to execute with the generated chat ID.
 * @returns {Promise<void>} A promise that resolves after the chat is created and the callback is executed.
 */
export const createChat = async (users, title = '', callback) => {
  const chat = {
    users,
    title,
    messages: [],
    createdOn: new Date().toString(),
  };

  const result = await push(ref(db, 'chats'), chat);
  const id = result.key;
  await update(ref(db, `chats/${id}`), { id });
  return callback(id);
};

/**
 * Updates a specific element of a chat in the database.
 *
 * @async
 * @function updateChat
 * @param {string} chatId - The unique identifier of the chat to update.
 * @param {*} updatedChat - The new value to update the specified element with.
 * @param {string} element - The key of the element in the chat object to update.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export const updateChat = async (chatId, updatedChat, element) => {
  await update(ref(db, `chats/${chatId}`), { [element]: updatedChat });
};

/**
 * Marks a chat as deleted by updating its `isDeleted` property to `true` in the database.
 *
 * @async
 * @function deleteChat
 * @param {string} chatId - The unique identifier of the chat to be marked as deleted.
 * @returns {Promise<void>} Resolves when the chat is successfully marked as deleted.
 */
export const deleteChat = async (chatId) => {
  await update(ref(db, `chats/${chatId}`), { isDeleted: true });
};

export const sortChats = (chats, sortBy = 'title') => {
  if (sortBy !== 'title') {
    chats.sort((a, b) => {
      const lastAMessageId = a.messages[a.messages.length - 1];
      const lastBMessageId = b.messages[b.messages.length - 1];
      const lastAMessage = getMessageById(lastAMessageId);
      const lastBMessage = getMessageById(lastBMessageId);
      switch (sortBy) {
        case 'oldest':
          return new Date(lastAMessage.createdOn) - new Date(lastBMessage.createdOn);
        default:
          return new Date(lastBMessage.createdOn) - new Date(lastAMessage.createdOn);
      }
    });
  }
  if (sortBy === 'title') {
    return chats.sort((a, b) => a.title.localeCompare(b.title));
  }
  return chats;
};

export const getChatByParticipants = async (participants) => {
  const chatsRef = ref(db, 'chats');
  const snapshot = await get(chatsRef);
  if (snapshot.exists()) {
    const chats = snapshot.val();
    const chat = Object.values(chats).find(
      (chat) => chat.users.length === participants.length && chat.users.every((user) => participants.includes(user)) && !chat.isDeleted // Ensure it's not a deleted chat
    );
    return chat || null;
  } else {
    return null;
  }
};

export const getChatByMessageId = async (messageId) => {
  const chatsRef = ref(db, 'chats');
  const snapshot = await get(chatsRef);
  
  if (!snapshot.exists()) return null;

  const chats = snapshot.val();

  const chatId = Object.keys(chats).find(chatId => {
    const chat = chats[chatId];
    return chat.messages && messageId in chat.messages;
  });

  return chatId ? { id: chatId, ...chats[chatId] } : null;
};
