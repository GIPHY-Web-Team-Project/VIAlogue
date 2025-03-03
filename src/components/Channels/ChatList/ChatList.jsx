import React, { useEffect, useContext } from 'react';
import { ChatContext } from '../../../store/chat.context';
import { getChatsByUserId } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';

export const ChatList = ({ userId }) => {
    const { chats, setChats, setSelectedChat } = useContext(ChatContext);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = getChatsByUserId(userId, (chats) => {
            setChats(chats);
        });

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [userId]);

    const handleNewChat = () => {
        navigate(`/chats/newchat`);
    }

    const handleChatClick = (chat) => {
        setSelectedChat(chat);
        navigate(`/chats/${chat.id}`);
    };

    return (
        <div>
            <br/>
            {chats && chats.length > 0 ? (
                chats.map(chat => (
                    <div key={chat.id} onClick={() => handleChatClick(chat)}>
                        <button>{chat.title}</button>
                    </div>
                ))) : (
                <div>
                    <p>No chats yet. Click below to start your first chat: </p>
                    <br />
                </div>
            )
            }
            <br/>
            <button onClick={handleNewChat} className='btn'>Start a new chat</button>
        </div>
    )
}