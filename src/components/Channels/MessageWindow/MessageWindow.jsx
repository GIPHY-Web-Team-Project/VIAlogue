import React, { useState } from 'react';
import { addMessage } from '../../../services/message.services';

export const MessageWindow = ({ chatId, sender }) => {
    const [message, setMessage] = useState('');

    const handleNewMessage = () => {
        addMessage(chatId, message, sender);
        setMessage(''); 
    }

    return (
        <div>
            <input 
                type="text" 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleNewMessage}>Send</button>
        </div>
    )
}

export default MessageWindow;