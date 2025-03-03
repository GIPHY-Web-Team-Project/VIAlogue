import React, { useContext } from 'react';
import { ChatContext } from '../../../store/chat.context';
import { AppContext } from '../../../store/app-context';
import { MessageWindow } from '../MessageWindow/MessageWindow';
import { getMessagesByChatId } from '../../../services/message.services';
import { useEffect, useState } from 'react';
import SingleMessage from '../SingleMessage/SingleMessage';
import { useParams } from 'react-router-dom';

export const ChatWindow = ({ selectedChat }) => {
    const { userData } = useContext(AppContext);
    const [messages, setMessages] = useState(null);
    const { selectedChat: contextSelectedChat } = useContext(ChatContext);
    const { chatId: paramChatId } = useParams();
    const finalChatId = selectedChat?.id || contextSelectedChat?.id || paramChatId;

    useEffect(() => {
        if (!finalChatId) {
            console.warn("Chat ID is undefined!");
            return;
        }
        const unsubscribe = getMessagesByChatId(finalChatId, setMessages);
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [finalChatId]);

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className='flex flex-col flex-grow'>
                {selectedChat && <h1>{selectedChat.title.toUpperCase()}</h1>}
                <br/>
                {messages ? (
                    messages.map((messageObj) => (
                        <div key={messageObj.id}>
                            <SingleMessage key={messageObj.id} msg={messageObj}/>
                        </div>
                        ))
                ) : (
                    <p>No messages yet. Start typing and send your first message.</p>
                )}
                <MessageWindow chatId={finalChatId} sender={userData?.username || 'Unknown'} />
            </div>
        </div>
    )
}

export default ChatWindow;


