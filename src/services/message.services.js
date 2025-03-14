import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';

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
                onValue(messageRef, (msgSnapshot) => {
                    if (msgSnapshot.exists()) {
                        messages.push(msgSnapshot.val());
                    }
                    resolve();
                }, { onlyOnce: true });
            });
        }

        callback(messages);
    });
};

export const addMessage = async (chatId, message, sender, gifUrl = "") => {
    const newMessage = {
        chatId,
        message,
        createdOn: new Date().toString(),
        sender,
        gifUrl,
        reactions: {},
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

export const updateMessage = async (chatId, messageId, updatedMessage, element) => {
    try {
        await update(ref(db, `messages/${messageId}`), { [element]: updatedMessage });
        await update(ref(db, `chats/${chatId}/messages/${messageId}`), { [element]: updatedMessage });
        console.log("Message updated successfully!");
    } catch (error) {
        console.error("Error updating message:", error);
    }
};

