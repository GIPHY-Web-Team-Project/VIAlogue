import React, { useContext } from 'react';
import { ChatContext } from '../../../store/chat.context';
import { AppContext } from '../../../store/app-context';
import { MessageWindow } from '../MessageWindow/MessageWindow';
import { getMessagesByChatId } from '../../../services/message.services';
import { ChatList } from '../../Channels/ChatList/ChatList';
import { useEffect, useState } from 'react';
import SingleMessage from '../SingleMessage/SingleMessage';

export const ChatWindow = ({ selectedChat }) => {
    const { userData } = useContext(AppContext);
    const [messages, setMessages] = useState(null);
    const { selectedChat: contextSelectedChat } = useContext(ChatContext);

    useEffect(() => {
        const chatId = selectedChat?.id || contextSelectedChat?.id;
        if (!chatId) return;

        const unsubscribe = getMessagesByChatId(chatId, setMessages);
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [selectedChat, contextSelectedChat]);

    return (
        <div>
            {selectedChat && <h2>{selectedChat.title}</h2>}
            {messages ? (
                messages.map(message => (
                <SingleMessage key={message.id} message={message} />
            ))
            ) : (
                <p>No messages yet</p>
            )}
            <MessageWindow chatId={selectedChat?.id} sender={userData.username} />
        </div>
    )
}

export default ChatWindow;


