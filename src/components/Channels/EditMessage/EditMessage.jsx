import React, { useState } from 'react';
import { updateMessage } from '../../../services/message.services';
import { useNavigate } from 'react-router-dom';

export const EditMessage = ({ message }) => {
    const [text, setText] = useState(message.text);
    const navigate = useNavigate();

    const handleUpdate = () => {
        updateMessage(message.chatId, message.id, text);
        navigate(`/users/username/chats/${message.chatId}`);
    }

    return (
        <div>
            <input value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => navigate(`/users/username/chats/${message.chatId}`)}>Cancel</button>
        </div>
    )
}

export default EditMessage;