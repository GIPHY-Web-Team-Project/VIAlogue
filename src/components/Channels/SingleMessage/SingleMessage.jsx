import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMessage } from '../../../services/message.services';
import EditMessage from '../EditMessage/EditMessage';

export const SingleMessage = ({ message }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/users/username/chats/:chatId/messages/:messageId/edit')
    }

    return (
        <div className='message'>
            {message.sender} {message.createdOn}
            {message.text}
            <button onClick={handleEdit}>✏️</button>
            <button onClick={() => deleteMessage(message.chatId, message.id)}>✖️</button>
        </div>
    )
}

export default SingleMessage;