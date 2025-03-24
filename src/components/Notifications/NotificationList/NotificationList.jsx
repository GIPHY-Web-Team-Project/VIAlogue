import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SingleNotification from "../SingleNotification/SingleNotification";
import { useContext } from "react";
import { AppContext } from "../../../store/app-context";
import { getNotificationsByUsername } from "../../../services/notification.service";
import { deleteAllNotifications } from "../../../services/notification.service";

const NotificationList = () => {
    const { userData } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const unsubscribe = getNotificationsByUsername(userData.username, (receivedNotifications) => {
            setNotifications(receivedNotifications);
            setLoading(false);
        });

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [userData]);

    const handleDeleteAll = async () => {
        await deleteAllNotifications(userData.username);
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
                                        <SingleNotification key={notificationObj.id} notification={notificationObj} />
                                    </li>
                                )
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
}

export default NotificationList;

NotificationList.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.string,
            message: PropTypes.string,
        })
    ).isRequired,
};
