import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMessage } from '../../../services/message.services';
import EditMessage from '../EditMessage/EditMessage';
import { useState } from 'react';

export const SingleMessage = ({ msg }) => {
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState(false);
    const handleEdit = () => {
        setShowEdit(true);
        navigate('/chats/:chatId/messages/:messageId/edit')
    }

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    return (
        <div className='message'>
            {!showEdit && 
                <div>
                    <span>{msg.sender} </span> 
                    <span>{formatDate(msg.createdOn)}:</span>
                    <button onClick={handleEdit}>✏️</button>
                    <button onClick={() => deleteMessage(msg.chatId, msg.id)}>✖️</button>
                    <br/>
                    <span>{msg.message} </span>
                    <br/>
                    <br/>
                </div>
            }
            {showEdit && 
                <EditMessage message={msg} />
            }
        </div>
    )
}

export default SingleMessage;