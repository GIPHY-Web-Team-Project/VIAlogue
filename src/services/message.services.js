import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { CHANNEL } from '../common/enums';

export const getMessagesByChatId = async (chat, callback, type) => {
  let chatMessagesRef;
  if (type === CHANNEL) {
    chatMessagesRef = ref(db, `teams/${chat.teamId}/channels/${chat.id}/chat/${Object.values(chat.chat)[0].id}/messages`);
  } else {
    chatMessagesRef = ref(db, `chats/${chat.id}/messages`);
  }

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

export const addMessage = async (chatObj, message, sender, type, gifUrl = '') => {
  const newMessage = {
    chatId: chatObj.id,
    message,
    createdOn: new Date().toString(),
    sender,
    gifUrl,
    reactions: {},
  };
  const result = await push(ref(db, `messages`), newMessage);
  const id = result.key;
  await update(ref(db, `messages/${id}`), { id });
  if (type === CHANNEL) {
    await update(ref(db, `teams/${chatObj.teamId}/channels/${chatObj.id}/chat/${Object.values(chatObj.chat)[0].id}/messages/${id}`), { [id]: true });
  } else {
    await update(ref(db, `chats/${chatObj.id}/messages/${id}`), { [id]: true });
  }
};

export const deleteMessage = async (chatId, messageId) => {
  await remove(ref(db, `messages/${messageId}`));
  await remove(ref(db, `chats/${chatId}/messages/${messageId}`));
};

export const updateMessage = async (chatId, messageId, updatedMessage, element) => {
  try {
    await update(ref(db, `messages/${messageId}`), { [element]: updatedMessage });
    await update(ref(db, `chats/${chatId}/messages/${messageId}`), { [element]: updatedMessage });
    console.log('Message updated successfully!');
  } catch (error) {
    console.error('Error updating message:', error);
  }
};
