import React, { useEffect, useContext } from 'react';
import { ChatContext } from '../../../store/chat.context';
import { getChatsByUserId } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../store/app-context';
import CreateChat from '../CreateChat/CreateChat';

export const ChatList = ({ userId }) => {
    const { userData } = useContext(AppContext);
    const { chats, setChats, selectedChat, setSelectedChat } = useContext(ChatContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchChats() {
            try {
                const unsubscribe = await getChatsByUserId(userId, ((chats) => {
                    setChats(chats);
                }));
                return () => {
                    if (typeof unsubscribe === 'function') {
                        unsubscribe();
                    }
                };
            } catch {
                console.log('Error getting chats');
            }
        }
        fetchChats();
    }, [userId, setChats]);

    const handleNewChat = () => {
        navigate(`/users/${userData.username}/chats/newchat`);
    }

    return (
        <div>
            {chats ? (chats.map(chat => (
                <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`chat ${selectedChat && selectedChat.id === chat.id ? 'selected' : 'normal'}`}>
                    {chat.title}
                </div>
            ))) : (
                <p>No chats yet</p>
            )
            }
            <button onClick={handleNewChat}>New Chat</button>
        </div>
    )
}