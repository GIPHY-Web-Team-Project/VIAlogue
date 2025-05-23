import React, { useState } from 'react';
import { addMessage } from '../../../services/message.services';
import Button from '../../UI/Button/Button';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { API_KEY } from '../../../common/constants';
import PropTypes from 'prop-types';
import { CHAT_SEND } from '../../../common/enums';
import Modal from '../../UI/Modal/Modal';
import * as Popover from '@radix-ui/react-popover';

/**
 * MessageWindow component allows users to send messages, emojis, and GIFs in a chat interface.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.chatId - The unique identifier for the chat.
 * @param {string} props.sender - The sender's identifier or name.
 *
 * @returns {JSX.Element} The rendered MessageWindow component.
 *
 * @description
 * - Users can type messages in a textarea and send them by pressing the "Send" button or hitting "Enter".
 * - Emojis can be added to the message using the emoji picker.
 * - GIFs can be sent directly using the GIF picker.
 *
 * @state {string} message - The current message being typed by the user.
 * @state {boolean} showEmojiPicker - Controls the visibility of the emoji picker.
 * @state {boolean} showGifPicker - Controls the visibility of the GIF picker.
 *
 */
export const MessageWindow = ({ chatId, sender }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  /**
   * Handles the creation of a new message.
   * Prevents adding empty messages and resets the input field after adding a message.
   *
   * @function
   * @returns {void}
   */
  const handleNewMessage = async () => {
    if (message.trim() === '') return;
    await addMessage(chatId, message, sender);
    setMessage('');
  };

  /**
   * Handles the keydown event for a text input field.
   * Prevents the default behavior and triggers the `handleNewMessage` function
   * when the Enter key is pressed without the Shift key.
   *
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNewMessage();
    }
  };

  /**
   * Handles the click event for selecting an emoji.
   * Appends the selected emoji to the current message input and toggles the visibility of the emoji picker.
   *
   * @param {Object} emojiObject - The emoji object containing details of the selected emoji.
   * @param {string} emojiObject.emoji - The emoji character selected by the user.
   */
  const handleEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(!showEmojiPicker);
  };

  /**
   * Handles the event when a GIF is clicked by the user.
   * Sends the selected GIF as a message and toggles the GIF picker visibility.
   *
   * @async
   * @function handleGifClick
   * @param {Object} gifObject - The object representing the selected GIF.
   * @param {string} gifObject.url - The URL of the selected GIF.
   * @throws Will log an error to the console if sending the message fails.
   */
  const handleGifClick = async (gifObject) => {
    try {
      await addMessage(chatId, '', sender, gifObject.url);
    } catch (error) {
      console.error(error);
      setModalMessage('GIF could not be sent. Please try again.');
      setShowModal(true);
    }
    setShowGifPicker(!showGifPicker);
  };

  return (
    <div className='mt-4 border border-gray-500 flex flex-row justify-between p-2 rounded-lg sticky bottom-0'>
      <textarea className='flex-1 p-2 mr-2 border-none rounded-lg resize-none focus:ring-2 focus:ring-blue-500' rows='1' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
      <Popover.Root open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <Popover.Trigger asChild>
          <button className='mr-4'>
            😀
          </button>
        </Popover.Trigger>
        <Popover.Content side="top" align="end" className="z-10 bg-white shadow-lg rounded p-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme='dark' />
        </Popover.Content>
      </Popover.Root>
      <Popover.Root open={showGifPicker} onOpenChange={setShowGifPicker}>
        <Popover.Trigger asChild>
          <button className="mr-4 hover:text-blue">
            GIF
          </button>
        </Popover.Trigger>
        <Popover.Content side="top" align="end" className="z-10 bg-white shadow-lg rounded p-2">
          <GifPicker tenorApiKey={API_KEY} onGifClick={handleGifClick} theme="dark" />
        </Popover.Content>
      </Popover.Root>
      <Button btnStyle={CHAT_SEND} onClick={handleNewMessage}>
        Send
      </Button>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
};

export default MessageWindow;

MessageWindow.propTypes = {
  chatId: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
};
