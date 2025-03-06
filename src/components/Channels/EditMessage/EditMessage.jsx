import React, { useState } from 'react';
import { updateMessage } from '../../../services/message.services';

export const EditMessage = ({ message, onCancel }) => {
    const [text, setText] = useState(message.message);

    const handleUpdate = async () => {
        if (text.trim() !== "") {
            await updateMessage(message.chatId, message.id, text);
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
            <button onClick={handleUpdate}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}

export default EditMessage;