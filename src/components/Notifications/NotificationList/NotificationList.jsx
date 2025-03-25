import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import SingleNotification from "../SingleNotification/SingleNotification";
import { useContext } from "react";
import { AppContext } from "../../../store/app-context";
import { getNotificationsByUsername } from "../../../services/notification.service";
import { deleteAllNotifications, deleteNotification } from "../../../services/notification.service";
import notificationSound from '/new-notification.wav';

const NotificationList = () => {
    const { userData } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevNotifications = useRef([]);
    const audioRef = useRef(null);
    const isFirstLoad = useRef(true);
    const soundLock = useRef(false);

    useEffect(() => {
        audioRef.current = new Audio(notificationSound);
        audioRef.current.volume = 0.5;

        const unsubscribe = getNotificationsByUsername(userData.username, (receivedNotifications) => {
            if (isFirstLoad.current) {
                isFirstLoad.current = false;
                setNotifications(receivedNotifications);
                prevNotifications.current = receivedNotifications;
                setLoading(false);
                return;
            }

            const newNotifications = receivedNotifications.filter(
                newNotif => !prevNotifications.current.some(
                    prevNotif => prevNotif.id === newNotif.id
                )
            );

            if (newNotifications.length > 0 && !soundLock.current) {
                soundLock.current = true;
                audioRef.current.currentTime = 0;
                audioRef.current.play()
                    .then(() => {
                        const soundDuration = audioRef.current.duration * 1000 || 1000;
                        setTimeout(() => {
                            soundLock.current = false;
                        }, soundDuration + 200);
                    })
                    .catch(error => {
                        console.error("Audio play failed:", error);
                        soundLock.current = false;
                    });
            }

            setNotifications(receivedNotifications);
            prevNotifications.current = receivedNotifications;
            setLoading(false);
        });

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [userData.username]);

    const handleDeleteAll = async () => {
        await deleteAllNotifications(userData.username);
        setNotifications([]);
        prevNotifications.current = [];
    };

    const handleDeleteNotification = async (notificationId) => {
        await deleteNotification(userData.username, notificationId);
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== notificationId)
        );
        prevNotifications.current = prevNotifications.current.filter(
            notification => notification.id !== notificationId
        );
    };

    return (
        <div className='absolute top-2 left-15 bg-gray-800 border rounded-lg shadow-lg p-4 border-gray-600 w-96 h-96 overflow-y-auto z-20'>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                </div>
            ) : notifications.length > 0 ? (
                <div>
                    <div className="flex flex-row justify-between">
                        <h3 className='mb-4 border-b-2 border-gray-600 w-full text-center py-2'>Notifications</h3>
                        <button className="text-gray-600 hover:text-gray-800 p-1 flex-row py-2 mb-4" onClick={handleDeleteAll}>Clear</button>
                    </div>
                    <ul className='text-left p-2 items-center justify-center'>
                        {notifications.map((notificationObj) => (
                            notificationObj.type !== 'message' && (
                                <li key={notificationObj.id}>
                                    <SingleNotification 
                                        notification={notificationObj} 
                                        onDelete={handleDeleteNotification}
                                    />
                                </li>
                            )
                        ))}
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
