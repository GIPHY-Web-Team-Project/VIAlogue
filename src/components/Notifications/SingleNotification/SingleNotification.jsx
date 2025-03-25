import React from 'react';
import PropTypes from 'prop-types';
import { deleteNotification } from '../../../services/notification.service';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { getChatById, getChatByMessageId } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';

/**
 * A React component that displays a single notification with a title, message, and a delete button.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.notification - The notification object containing details of the notification.
 * @param {string} props.notification.id - The unique identifier of the notification.
 * @param {string} props.notification.title - The title of the notification.
 * @param {string} props.notification.notification - The message content of the notification.
 * @param {Function} props.onDelete - Callback function to handle the deletion of the notification.
 *
 * @returns {JSX.Element} The rendered SingleNotification component.
 */
const SingleNotification = ({ notification, onDelete }) => {
    const { id: notificationId, title, notification: message, type, relatedId } = notification;
    const { userData, setSelectedChat } = useContext(AppContext);
    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteNotification(userData.username, notificationId);
        onDelete(notificationId);
    };

    const handleNotificationClick = async () => {
        if (type === 'chat') {
            try {
                const chat = await getChatByMessageId(relatedId);
  
                if (chat) {
                    console.log("Found chat:", chat);
                    setSelectedChat({ ...chat});
                    navigate('/chats');
                } else {
                    console.log("No chat found containing this message");
                }
            } catch (error) {
                console.error("Error finding chat by message:", error);
            }
        }
        if (type === 'team') {
            navigate(`/teams/${relatedId}`);
        }
        if (type === 'reaction') {
            console.log(relatedId);
            const chatByMessage = await getChatByMessageId(relatedId);
            console.log(chatByMessage);
            setSelectedChat(chatByMessage);
            navigate('/chats');
        }
        console.log('Notification clicked!');
    }

    return (
        <div className='flex flex-col border-b-2 border-gray-500 w-full m-2 py-2' onClick={handleNotificationClick}>
            <div className='flex flex-row justify-between w-full'>
                <h2 className='my-2 text-gray-400'>{title}</h2>
                <button className="text-gray-600 hover:text-gray-900 p-1 flex-row cursor-pointer text-3xl" onClick={handleDelete}>X</button>
            </div>
            <p>{message}</p>
        </div>
    );
};

SingleNotification.propTypes = {
    notification: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
        notification: PropTypes.string,
        relatedId: PropTypes.string,
    }).isRequired,
    onDelete: PropTypes.func.isRequired, 
};

export default SingleNotification;
