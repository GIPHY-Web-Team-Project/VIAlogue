import React, { useContext, useEffect } from 'react';
import { ChatContext } from '../../store/chat.context';
import { AppContext } from '../../store/app-context';
import { ChatList } from '../../components/Channels/ChatList/ChatList';
import { ChatWindow } from '../../components/Channels/ChatWindow/ChatWindow';

export const ChatPage = () => {
    const { userData } = useContext(AppContext);
    const { selectedChat, setSelectedChat } = useContext(ChatContext);
    
    useEffect(() => {
        const lastChat = localStorage.getItem('lastSelectedChat');
        if (lastChat) {
            setSelectedChat(JSON.parse(lastChat));
        }
    }, [setSelectedChat]);

    useEffect(() => {
        if (selectedChat) {
            localStorage.setItem('lastSelectedChat', JSON.stringify(selectedChat));
        }
    }, [selectedChat]);

    return (
        <div style={{ display: 'flex' }}>
            {userData && (
                <>
                    <div style={{ flex: 1 }}>
                        <ChatList userId={userData.uid} />
                    </div>
                    <br/><br/>
                    <div style={{ flex: 2 }}>
                        {selectedChat && <ChatWindow selectedChat={selectedChat} />}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatPage;