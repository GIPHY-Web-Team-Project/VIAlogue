import React from 'react';
import { updateMessage } from '../../../services/message.services';
import { useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { useEffect } from 'react';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { addNotification } from '../../../services/notification.service';

/**
 * EmojiList component allows users to react to a message with emojis.
 * Users can add or remove their reactions, and the component updates the message's reactions accordingly.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.message - The message object containing details about the message and its reactions.
 * @param {Object} props.message.reactions - An object where keys are emoji strings and values are arrays of usernames who reacted with that emoji.
 * @param {string} props.message.chatId - The ID of the chat the message belongs to.
 * @param {string} props.message.id - The unique ID of the message.
 *
 * @returns {JSX.Element} A list of emoji buttons for reacting to the message.
 */
export const EmojiList = ({ message }) => {
    const emojis = ['👍', '❤️', '😂', '😯', '😢', '😡'];
    const { userData } = useContext(AppContext);
    const [reaction, setReaction] = useState(message.reactions);
    const [userReaction, setUserReaction] = useState(null);

    useEffect(() => {
        if (!message.reactions || Object.keys(message.reactions).length === 0) {
            setReaction({});
        }

        if (message.reactions) {
            for (const [emoji, users] of Object.entries(message.reactions)) {
                if (Array.isArray(users) && users.includes(userData.username)) {
                    setUserReaction(emoji);
                    return;
                }
            }
        }
    }, [message.reactions, userData.username]);

    /**
     * Handles the click event for an emoji reaction, updating the user's reaction
     * and the overall reactions for a message.
     *
     * @param {string} emoji - The emoji that was clicked by the user.
     * @returns {Promise<void>} A promise that resolves when the message reactions
     *                          have been updated.
     */
    const handleEmojiClick = async (emoji) => {
        let updatedReactions = { ...reaction };

        if (userReaction === emoji) {
            updatedReactions[emoji] = updatedReactions[emoji].filter(username => username !== userData.username);
            if (updatedReactions[emoji].length === 0) delete updatedReactions[emoji];
            setUserReaction(null);
        } else {
            if (userReaction) {
                updatedReactions[userReaction] = updatedReactions[userReaction].filter(username => username !== userData.username);
                if (updatedReactions[userReaction].length === 0) delete updatedReactions[userReaction];
            }

            if (!updatedReactions[emoji]) updatedReactions[emoji] = [];
            updatedReactions[emoji].push(userData.username);
            setUserReaction(emoji);
        }

        setReaction(updatedReactions);
        await updateMessage(message.chatId, message.id, updatedReactions, "reactions");
        if (message.sender !== userData.username) {
            if (userReaction !== null) {
                await addNotification(message.sender, 'Reaction', `${userData.username} removed their reaction from your message.`);
            } else {
                await addNotification(message.sender, 'Reaction', `${userData.username} reacted with ${emoji} to your message.`);
            }
        }
    };

    return (
        <div className="flex flex-row gap-2">
            {emojis.map((emoji, index) => (
                <button key={index} onClick={() => handleEmojiClick(emoji)}>{emoji}</button>
            ))}
        </div>
    );
}

export default EmojiList;

EmojiList.propTypes = {
    message: PropTypes.object.isRequired
};
