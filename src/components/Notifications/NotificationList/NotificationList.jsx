import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SingleNotification from "../SingleNotification/SingleNotification";
import { useContext } from "react";
import { AppContext } from "../../../store/app-context";
import { getNotificationsByUsername } from "../../../services/notification.service";
import { deleteAllNotifications, deleteNotification } from "../../../services/notification.service";
import notificationSound from '/new-notification.wav';

/**
 * NotificationList Component
 * 
 * This component displays a list of notifications for the current user. It fetches notifications
 * based on the user's username and provides functionality to delete individual notifications or 
 * clear all notifications at once.
 * 
 * Features:
 * - Fetches notifications in real-time using a subscription mechanism.
 * - Displays a loading spinner while notifications are being fetched.
 * - Allows users to delete individual notifications or clear all notifications.
 * - Displays a message when there are no notifications.
 * 
 * @component
 * @returns {JSX.Element} The rendered NotificationList component.
 *
 * @dependencies
 * - React (useState, useEffect, useContext)
 * - AppContext for accessing user data.
 * - Utility functions: getNotificationsByUsername, deleteAllNotifications, deleteNotification.
 * - SingleNotification component for rendering individual notifications.
 */
const NotificationList = () => {
    const { userData } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [prevNotificationCount, setPrevNotificationCount] = useState(0);
    const audio = new Audio(notificationSound);

    useEffect(() => {
        setLoading(true);

        const unsubscribe = getNotificationsByUsername(userData.username, (receivedNotifications) => {
            if (receivedNotifications.length > prevNotificationCount) {
                audio.play(); // Play sound when a new notification is added
            }

            setNotifications(receivedNotifications);
            setPrevNotificationCount(receivedNotifications.length);
            setLoading(false);
        });

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, [userData.username]);

    const handleDeleteAll = async () => {
        await deleteAllNotifications(userData.username);
        setNotifications([]);
    };

    const handleDeleteNotification = async (notificationId) => {
        await deleteNotification(userData.username, notificationId);
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== notificationId)
        );
    };

    return (
        <div className='absolute top-2 left-15 bg-gray-800 border rounded-lg shadow-lg p-4 border-gray-600 w-96 h-96 overflow-y-auto z-20'>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                </div>
            ) : notifications && notifications.length > 0 ? (
                <div>
                    <div className="flex flex-row justify-between">
                        <h3 className='mb-4 border-b-2 border-gray-600 w-full text-center py-2'>Notifications</h3>
                        <button className="text-gray-600 hover:text-gray-800 p-1 flex-row py-2 mb-4" onClick={handleDeleteAll}>Clear</button>
                    </div>
                    <ul className='text-left p-2 items-center justify-center'>
                        {notifications.map((notificationObj) => {
                            if (notificationObj.type === 'other') {
                                return (
                                    <li key={notificationObj.id}>
                                        <SingleNotification 
                                            notification={notificationObj} 
                                            onDelete={handleDeleteNotification} // Pass handler here
                                        />
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center'>
                    <h2 className='mb-4 border-b-2 border-gray-600 w-full text-center py-2'>Notifications</h2>
                    <p className="text-xs text-gray-400 h-full p-2">No notifications yet.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationList;

NotificationList.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            type: PropTypes.string,
            message: PropTypes.string,
        })
    ).isRequired,
};
