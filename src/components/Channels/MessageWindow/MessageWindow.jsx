import React, { useState } from 'react';
import { addMessage } from '../../../services/message.services';
import Button from '../../UI/Button/Button';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { API_KEY } from '../../../common/constants';

export const MessageWindow = ({ chatId, sender }) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);

  const handleNewMessage = () => {
    if (message.trim() === '') return;
    addMessage(chatId, message, sender);
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

    const handleGifClick = async (gifObject) => {
        try {
            await addMessage(chatId, "", sender, gifObject.url);
            setShowGifPicker(!showGifPicker);
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <div className='mt-4 border border-gray-500 flex flex-row justify-between p-2 rounded-lg sticky bottom-0'>
      <textarea className='flex-1 p-2 mr-2 border-none rounded-lg resize-none focus:ring-2 focus:ring-blue-500' rows='1' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />

            <button className="mr-4" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
            {showEmojiPicker && (
                <div className="absolute bottom-20 right-10 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark"/>
                </div>
            )}
            <button className="mr-4" onClick={() => setShowGifPicker(!showEmojiPicker)}>GIF</button>
            {showGifPicker && (
                <div className="absolute bottom-20 right-15 z-10">
                    <GifPicker tenorApiKey={API_KEY} onGifClick={handleGifClick} theme="dark"/>
                </div>
            )}
            <Button onClick={handleNewMessage}>Send</Button>
        </div>
    )
}

export default MessageWindow;
