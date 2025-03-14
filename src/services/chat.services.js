import { db } from '../config/firebase-config';
import { ref, push, onValue, update, get } from 'firebase/database';

export const getChatsByUsername = async (username, callback) => {
    const chatsRef = ref(db, 'chats');

    const unsubscribe = onValue(chatsRef, async (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const chatsData = snapshot.val();
        const filteredChats = Object.values(chatsData).filter(chat =>
            chat.users.includes(username) && !chat.isDeleted
        );

        const chatPromises = filteredChats.map(async (chat) => {
            if (chat.messages && Object.keys(chat.messages).length > 0) {
                const messageIds = Object.keys(chat.messages);
                const latestMessageId = messageIds[messageIds.length - 1];

                const messageRef = ref(db, `messages/${latestMessageId}`);
                const messageSnapshot = await get(messageRef);

                if (messageSnapshot.exists()) {
                    chat.latestMessage = messageSnapshot.val();
                } else {
                    chat.latestMessage = null;
                }
            } else {
                chat.latestMessage = null;
            }
            return chat;
        });

        const updatedChats = await Promise.all(chatPromises);
        callback(updatedChats);
    });

    return unsubscribe;
}

export const getChatById = async (chatId, callback) => {
    const chatRef = await ref(db, `chats/${chatId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
        if(snapshot.exists()) {
            return callback(Object.values(snapshot.val()));
        } else {
            return callback(null);
        }
    })
    return unsubscribe;
}

export const createChat = async (users, title = '', callback) => {
    console.log('Users: ' + users);
    console.log('title: ' + title);

    const chat = {
        users,
        title,
        messages: [],
    }

    const result = await push(ref(db, 'chats'), chat);
    const id = result.key;
    console.log('Chat ID: ' + id);
    await update(ref(db, `chats/${id}`), { id });
    return callback(id);
}

export const updateChat = async (chatId, updatedChat, element) => {
    await update(ref(db, `chats/${chatId}`), { [element]: updatedChat });
}

export const deleteChat = async (chatId) => {
    await update(ref(db, `chats/${chatId}`), { isDeleted: true });
}

export const sortChats = (chats, sortBy) => {
    switch (sortBy) {
        case 'recent':
            return chats.sort((a, b) => new Date(b.messages[b.messages.length - 1].createdOn) - new Date(a.messages[a.messages.length - 1].createdOn));
        case 'oldest':
            return chats.sort((a, b) => new Date(a.messages[a.messages.length - 1].createdOn) - new Date(b.messages[b.messages.length - 1].createdOn));
        case 'title':
            return chats.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return chats;
    }
}