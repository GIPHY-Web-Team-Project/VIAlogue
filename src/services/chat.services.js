import { db } from '../config/firebase-config';
import { ref, push, onValue, update, get } from 'firebase/database';


/**
 * Retrieves chats associated with a specific username and provides the data through a callback function.
 * Filters out deleted chats and includes the latest message for each chat if available.
 *
 * @async
 * @function getChatsByUsername
 * @param {string} username - The username to filter chats by.
 * @param {function} callback - A callback function to handle the retrieved chats. 
 *                              It receives an array of chat objects as its argument.
 * @returns {function} - A function to unsubscribe from the real-time database listener.
 */

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
            let unreadCount = 0;

            if (chat.messages) {
                const messageIds = Object.keys(chat.messages);
                for (const messageId of messageIds) {
                    const messageRef = ref(db, `messages/${messageId}`);
                    const messageSnapshot = await get(messageRef);
                    if (messageSnapshot.exists()) {
                        chat.latestMessage = messageSnapshot.val();
                        if (messageSnapshot.val().unreadBy?.includes(username)) {
                            unreadCount++;
                        }
                    } else {
                        chat.latestMessage = null;
                    }
                }
            }

            chat.unreadCount = unreadCount;
            return chat;
        });

        const updatedChats = await Promise.all(chatPromises);
        callback(updatedChats);
    });

    return unsubscribe;
}
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
    }

    const result = await push(ref(db, 'chats'), chat);
    const id = result.key;
    await update(ref(db, `chats/${id}`), { id });
    return callback(id);
}

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
}

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