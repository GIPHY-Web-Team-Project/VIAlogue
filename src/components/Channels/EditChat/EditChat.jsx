import React, { useState } from 'react';
import { updateChat } from '../../../services/chat.services';
export const EditChat = ({ chat, onCancel}) => {
    const [title, setTitle] = useState(chat.title);

    const handleUpdate = async () => {
        if (title.trim() !== "") {
            await updateChat(chat.id, title, "title");
        }
        onCancel();
    }

    return (
        <div>
            <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                autoFocus
            />
            <button className="ml-2 mr-2" onClick={handleUpdate}>✔️</button>
            <button className="ml-2 mr-2" onClick={onCancel}>✖️</button>
        </div>
    )
}

export default EditChat;