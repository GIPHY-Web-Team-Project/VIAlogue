import React from 'react';
import { deleteMessage } from '../../../services/message.services';
import EditMessage from '../EditMessage/EditMessage';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';

export const SingleMessage = ({ msg }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const { userData } = useContext(AppContext);

    const handleEdit = () => {
        setShowEdit(true);
    }

    const formatDate = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleString(undefined, options);
    }

    return (
        <div className='message'>
            {showEdit ? (
                <EditMessage 
                    message={msg} 
                    onCancel={() => setShowEdit(false)}
                />
            ) : (
                <div className="flex-1 flex-col pr-2 ">
                    <div className="flex flex-row justify-between">
                        <h3 className={(userData.username === msg.sender) ?  "text-blue-700" : "text-blue-300"}><strong>{(userData.username === msg.sender) ? "You" : (msg.sender)}</strong></h3>
                        <label className="text-gray-500 text-xs items-center">{formatDate(msg.createdOn)}</label>
                    </div>
                    <div className="flex justify-between items-start mt-2">
                        <span className="text-gray-200">{msg.message} </span>
                        {(userData.username === msg.sender) && (
                            <div className="relative">
                                <button 
                                    className="text-gray-500 hover:text-gray-700" 
                                    onClick={() => setShowOptions(!showOptions)}
                                >
                                    ⋮
                                </button>
                        {showOptions && (
                                    <div className="absolute right-0 bg-gray-400 shadow-md rounded-md p-2 flex flex-col">
                                        <button className="text-gray-600 hover:text-gray-800 p-1 flex-row" onClick={handleEdit}>✏️ Edit</button>
                                        <button className="text-red-600 hover:text-red-800 p-1 flex-row" onClick={() => deleteMessage(msg.chatId, msg.id)}>✖️ Delete</button>
                                    </div>
                                )}
                            </div>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleMessage;