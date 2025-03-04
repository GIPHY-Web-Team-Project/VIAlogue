import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMessage } from '../../../services/message.services';
import EditMessage from '../EditMessage/EditMessage';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';

export const SingleMessage = ({ msg }) => {
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState(false);
    const { userData } = useContext(AppContext);

    const handleEdit = () => {
        setShowEdit(true);
        navigate('/chats/:chatId/messages/:messageId/edit')
    }

    const formatDate = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    return (
        <div className='message'>
            {!showEdit &&
                <div>
                    {(userData.username === msg.sender) ? (
                        <h3><strong>(You)</strong></h3>
                    ) : (
                        <h3><strong>{msg.sender}</strong></h3>
                    )}
                    <span>{formatDate(msg.createdOn)}</span>
                    <br />
                    <span>{msg.message} </span>
                    {(userData.username === msg.sender) && (
                        <div>
                            <button onClick={handleEdit}>✏️</button>
                            <button onClick={() => deleteMessage(msg.chatId, msg.id)}>✖️</button>
                        </div>
                    )}
                    <br />
                    <br />
                </div>
            }
            {showEdit &&
                <EditMessage message={msg} />
            }
        </div>
    )
}

export default SingleMessage;