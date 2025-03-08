import React, { useState } from 'react';
import { updateMessage } from '../../../services/message.services';

export const EditMessage = ({ message, onCancel }) => {
    const [text, setText] = useState(message.message);

    const handleUpdate = async () => {
        if (text.trim() !== "") {
            await updateMessage(message.chatId, message.id, text, "message");
        }
        onCancel();
    }

    return (
        <div>
            <input 
                value={text} 
                onChange={e => setText(e.target.value)} 
                autoFocus
            />
            <button className="ml-2 mr-2" onClick={handleUpdate}>✔️</button>
            <button className="ml-2 mr-2" onClick={onCancel}>✖️</button>
        </div>
    )
}

export default EditMessage;