import React, { useState } from 'react';
import { addMessage } from '../../../services/message.services';
import Button from '../../UI/Button/Button';
import EmojiPicker from 'emoji-picker-react';

export const MessageWindow = ({ chat, sender, type }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleNewMessage = () => {
    if (message.trim() === '') return;

    addMessage(chat, message, sender, type);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNewMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className='mt-4 border border-gray-500 flex flex-row justify-between p-2 rounded-lg sticky bottom-0'>
      <textarea className='flex-1 p-2 mr-2 border-none rounded-lg resize-none focus:ring-2 focus:ring-blue-500' rows='1' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />

      <button className='mr-4' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        😀
      </button>
      {showEmojiPicker && (
        <div className='absolute bottom-20 right-10 z-10'>
          <EmojiPicker onEmojiClick={handleEmojiClick} theme='dark' />
        </div>
      )}
      <Button onClick={handleNewMessage}>Send</Button>
    </div>
  );
};

export default MessageWindow;
