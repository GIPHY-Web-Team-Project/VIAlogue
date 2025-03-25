import { db } from '../config/firebase-config';
import { ref, onValue, push, get, update, remove } from 'firebase/database';

export const getNotificationsByUsername = async (username, callback) => {
    const notificationsRef = ref(db, `users/${username}/notifications`);
    
    onValue(notificationsRef, async (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const notificationIds = Object.keys(snapshot.val());
        const notifications = [];

        for (const notificationId of notificationIds) {
            const notificationRef = ref(db, `notifications/${notificationId}`);
            await new Promise((resolve) => {
                onValue(notificationRef, (msgSnapshot) => {
                    if (msgSnapshot.exists()) {
                        notifications.push(msgSnapshot.val());
                    }
                    resolve();
                }, { onlyOnce: true });
            });
        }

        callback(notifications);
    });
};

export const addNotification = async (username, title, notification, type = 'other', relatedId = '') => {
    const userRef = ref(db, `users/${username}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) return;

    const newNotification = {
        username,
        title,
        notification,
        createdOn: new Date().toString(), 
        type,
        relatedId,
    };

    const result = await push(ref(db, `notifications`), newNotification);
    const id = result.key;

    await update(ref(db, `notifications/${id}`), { id });
    await update(ref(db, `users/${username}/notifications/${id}`), {[id] : true });
    console.log(`Notification added for ${username}: ${title}`);
}

export const deleteNotification = async (username, notificationId) => {
    await remove(ref(db, `notifications/${notificationId}`));
    await remove(ref(db, `users/${username}/notifications/${notificationId}`));
}

export const deleteAllNotifications = async (username) => {
    const notificationsRef = ref(db, `users/${username}/notifications`);
    const snapshot = await get(notificationsRef);
    if (!snapshot.exists()) return;

    const notificationIds = Object.keys(snapshot.val());

    for (const notificationId of notificationIds) {
        await deleteNotification(username, notificationId);
    }
}

export const getNotificationsCountForUser = async (username, callback) => {
    const notificationsRef = ref(db, `users/${username}/notifications`);
    onValue(notificationsRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback(0);
            return;
        }

        const notificationIds = Object.keys(snapshot.val());
        callback(notificationIds.length);
    });
}
