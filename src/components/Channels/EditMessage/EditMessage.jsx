import React, { useState } from 'react';
import { updateMessage } from '../../../services/message.services';
import PropTypes from 'prop-types';

/**
 * EditMessage component allows editing of a message with an input field.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.message - The message object to be edited.
 * @param {string} props.message.message - The current text of the message.
 * @param {string} props.message.chatId - The ID of the chat the message belongs to.
 * @param {string} props.message.id - The unique ID of the message.
 * @param {Function} props.onCancel - Callback function to handle cancel action.
 *
 * @returns {JSX.Element} The rendered EditMessage component.
 */
export const EditMessage = ({ message, onCancel }) => {
    const [text, setText] = useState(message.message);

    /**
     * Handles the update of a message. If the input text is not empty,
     * it updates the message by calling the `updateMessage` function
     * with the provided chat ID, message ID, text, and type. After the
     * update, it triggers the `onCancel` callback.
     *
     * @async
     * @function handleUpdate
     * @returns {Promise<void>} Resolves when the message update and cancellation are complete.
     */
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

EditMessage.propTypes = {
    message: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};
