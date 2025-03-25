import React, { useState } from 'react';
import { updateChat } from '../../../services/chat.services';
import PropTypes from 'prop-types';

/**
 * EditChat component allows editing the title of a chat.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.chat - The chat object containing details of the chat.
 * @param {string} props.chat.title - The current title of the chat.
 * @param {string} props.chat.id - The unique identifier of the chat.
 * @param {Function} props.onCancel - Callback function to handle cancel action.
 *
 * @returns {JSX.Element} The rendered EditChat component.
 */
export const EditChat = ({ chat, onCancel }) => {
  const [title, setTitle] = useState(chat.title);

  /**
   * Handles the update of a chat's title.
   * If the title is not empty, it updates the chat's title using the `updateChat` function.
   * After the update, it triggers the `onCancel` callback.
   *
   * @async
   * @function handleUpdate
   * @returns {Promise<void>} Resolves when the update and cancellation are complete.
   */
  const handleUpdate = async () => {
    if (title.trim() !== '') {
      await updateChat(chat.id, title, 'title');
    }
    onCancel();
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <button className='ml-2 mr-2' onClick={handleUpdate}>
        ✔️
      </button>
      <button className='ml-2 mr-2' onClick={onCancel}>
        ✖️
      </button>
    </div>
  );
};

export default EditChat;

EditChat.propTypes = {
  chat: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};
