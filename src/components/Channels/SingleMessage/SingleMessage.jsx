import React from 'react';
import { deleteMessage } from '../../../services/message.services';
import EditMessage from '../EditMessage/EditMessage';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import EmojiList from '../EmojiList/EmojiList';

export const SingleMessage = ({ msg, isFirstFromSender }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const { userData } = useContext(AppContext);
    const [showUsers, setShowUsers] = useState(false);

    const handleEdit = () => {
        setShowEdit(true);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        const options = isToday
            ? { hour: '2-digit', minute: '2-digit' }
            : { hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' };

        return date.toLocaleString(undefined, options);
    };

    return (
        <div className='message'
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}>
            {showEdit ? (
                <EditMessage
                    message={msg}
                    onCancel={() => setShowEdit(false)}
                />
            ) : (
                <div className="flex-1 flex-col pr-2 ">
                    <div className="flex flex-row justify-between">
                        {isFirstFromSender && (
                            <div className="pt-4 flex flex-row justify-between w-full">
                                <h3 className={(userData.username === msg.sender) ? "text-blue-700" : "text-blue-300"}>
                                    <strong>{userData.username === msg.sender ? "You" : msg.sender}</strong>
                                </h3>
                                <label className="text-gray-500 text-xs align-center ml-4">{formatDate(msg.createdOn)}</label>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row justify-between mt-2">
                        <div>
                            <span className="text-gray-200">{msg.message} </span>
                        </div>
                        <div className="relative">
                            {showOptions && (
                                <div className="absolute right-0 bg-gray-700 shadow-md rounded-md p-1 flex flex-row align-center">
                                    <EmojiList message={msg} />
                                    {userData.username === msg.sender && (
                                        <div className="flex flex-row">
                                            <button className="text-gray-600 hover:text-gray-800 p-1 flex-row" onClick={handleEdit}>✏️</button>
                                            <button className="text-gray-600 hover:text-gray-800 p-1 flex-row" onClick={() => deleteMessage(msg.chatId, msg.id)}>✖️</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between mt-2">
                        {msg.reactions && Object.values(msg.reactions).some(users => users.length > 0) && (
                            <div className="flex flex-row gap-2 bg-gray-700 rounded-md pl-1 pr-1 mt-1">
                                {Object.entries(msg.reactions).map(([emoji, users]) => (
                                    users.length > 0 && (
                                        <>
                                            <button key={emoji} className="flex flex-row items-center text-white px-2" onClick={() => setShowUsers(!showUsers)}>
                                                {emoji} {users.length}
                                            </button>
                                            {showUsers && (
                                                <ul key={emoji} className="absolute bg-gray-700 shadow-md rounded-md p-1 flex flex-col align-center mt-7">
                                                    {users.map((user) => (
                                                        <li key={user}>{user}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleMessage;