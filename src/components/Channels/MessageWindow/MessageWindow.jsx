import React, { useState } from 'react';
import { addMessage } from '../../../services/message.services';
import Button from '../../Button/Button';

export const MessageWindow = ({ chatId, sender }) => {
  const [message, setMessage] = useState('');

  const handleNewMessage = () => {
    console.log(chatId);
    console.log(message);
    addMessage(chatId, message, sender);
    setMessage('');
  };

  return (
    <div className='mt-4 border border-gray-500 flex flex-row justify-between p-2 rounded-lg'>
      <input type='text' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={handleNewMessage}>Send</Button>
    </div>
  );
};

export default MessageWindow;
