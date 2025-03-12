import React, { useEffect, useState } from 'react';
import { getChatsByUsername } from '../../../services/chat.services';

export const ChatList = ({ username, handleNewChat, chats, setChats, setSelectedChat }) => {

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
    <div className='bg-gray-800 p-4 overflow-y-auto w-80'>
      <div className='flex flex-row justify-between border-b-2 border-gray-600 mb-2'>
        <h3 className="flex flex-row mb-2">Chat</h3>
        <button onClick={() => handleNewChat()}>
          <img src="/images/newchat.jpg" alt="New chat" className="w-7 h-7 mb-2" />
        </button>
      </div>
      {chats && chats.length > 0 ? (
        chats.map((chat) => {
          return (
            <div key={chat.id} onClick={() => handleChatClick(chat)} >
              <button>{chat.title}</button>
              {chat.latestMessage ? (
                <p className="text-sm text-gray-400 overflow-ellipsis overflow-hidden">
                  <strong>{chat.latestMessage.sender}:</strong> {chat.latestMessage.message}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No messages yet</p>
              )}
            </div>
          )
        })
      ) : (
        <div>
          <p>No chats yet.</p>
        </div>
      )}
    </div>
  );
};
