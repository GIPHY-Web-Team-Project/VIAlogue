import React, { useContext } from 'react';
import { ChatContext } from '../../store/chat.context';
import { AppContext } from '../../store/app-context';
import { ChatList } from '../../components/Channels/ChatList/ChatList';
import { ChatWindow } from '../../components/Channels/ChatWindow/ChatWindow';

export const ChatPage = () => {
    const { user, userData } = useContext(AppContext);
    const { selectedChat } = useContext(ChatContext);

    return (
        <div>
            {userData && 
                <div>
                    <ChatList userId={user?.uid} />
                    { selectedChat ? (
                        <ChatWindow chat={selectedChat} /> 
                    ) : (
                        <p>You don't have any chats yet? Click on new chat and select some friends to start with!</p>
                    )}
                </div>
            }
        </div>
    )
}

export default ChatPage;