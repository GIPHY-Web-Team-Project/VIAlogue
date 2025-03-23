import React from 'react';
import PropTypes from 'prop-types';
import { deleteNotification } from '../../../services/notification.service';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';

const SingleNotification = ({ notification }) => {
    const { title, notification: message } = notification;
    const { userData } = useContext(AppContext);

    
    const handleDelete = async () => {
        console.log(notification.id);
        await deleteNotification(userData.username, notification.id);
        console.log('Notification deleted!');
    }
    
    return (
        <div className='flex flex-col border-b-2 border-gray-500 w-full m-2 py-2'>
            <div className='flex flex-row justify-between w-full'>
            <h2 className='my-2 text-gray-400'>{title}</h2>
            <button className="text-gray-600 hover:text-gray-900 p-1 flex-row cursor-pointer" onClick={handleDelete}>X</button>
            </div>
            <p>{message}</p>
        </div>
    );
};

export default SingleNotification;

SingleNotification.propTypes = {
    notification: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        type: PropTypes.string,
        notification: PropTypes.string,
    }).isRequired,
};
