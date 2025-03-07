import React from 'react';
import { updateMessage } from '../../../services/message.services';
import { useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { useEffect } from 'react';
import { useContext } from 'react';

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