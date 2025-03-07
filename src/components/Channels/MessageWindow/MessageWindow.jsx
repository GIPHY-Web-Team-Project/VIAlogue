import React, { useState } from 'react';
import { addMessage } from '../../../services/message.services';
import Button from '../../Button/Button';

export const MessageWindow = ({ chatId, sender }) => {
  const [message, setMessage] = useState('');

    const handleNewMessage = () => {
        if (message.trim() === '') return;
        addMessage(chatId, message, sender);
        setMessage(''); 
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleNewMessage();
        }
    };

    return (
        <div className="mt-4 border border-gray-500 flex flex-row justify-between p-2 rounded-lg">
            <textarea className="flex-1 p-2 mr-2 border-none rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                rows="1"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button onClick={handleNewMessage}>Send</Button>
        </div>
    )
}

export default MessageWindow;
