import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getMessagesByChatId = async (chatId, callback) => {
    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const messages = snapshot.val();
            callback(Object.values(messages));
        } else {
            callback([]);
        }
    });
    return unsubscribe;
}

export const addMessage = async (chatId, message, sender) => {
    const newMessage = {
        ...message,
        chatId,
        createdOn: new Date().toString(),
        sender,
    }
    const result = await push(ref(db, `messages`), newMessage);
    const id = result.key;
    await update(ref(db, `messages/${id}`), { id });
    await update(ref(db, `chats/${chatId}/messages/${id}`), {[id] : true });
}

export const deleteMessage = async (chatId, messageId) => {
    await remove(ref(db, `messages/${messageId}`));
    await remove(ref(db, `chats/${chatId}/messages/${messageId}`));
}

export const updateMessage = async (chatId, messageId, updatedMessage) => {
    await update(ref(db, `messages/${messageId}`), updatedMessage);
    /* await update(ref(db, `chats/${chatId}/messages/${messageId}`), updatedMessage); */
}

