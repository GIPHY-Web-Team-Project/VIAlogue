import React, { useEffect, useContext } from 'react';
import { ChatContext } from '../../../store/chat.context';
import { getChatsByUsername } from '../../../services/chat.services';

export const ChatList = ({ username, handleNewChat }) => {
  const { chats, setChats, setSelectedChat } = useContext(ChatContext);

  useEffect(() => {
    const unsubscribe = getChatsByUsername(username, (chats) => {
      setChats(chats);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [username]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className='bg-gray-800 p-4 overflow-y-auto'>
      <h3 className="flex flex-row border-b-2 mb-2 pb-3">Chat
        <button onClick={() => handleNewChat()}>
          <img src="/images/newchat.jpg" alt="New chat" className="w-7 h-7 ml-2"/>
        </button>
      </h3>
      {chats && chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id} onClick={() => handleChatClick(chat)}>
            <button>{chat.title}</button>
          </div>
        ))
      ) : (
        <div>
          <p>No chats yet.</p>
        </div>
      )}
    </div>
  );
};
