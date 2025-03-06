import React, { useEffect, useContext } from 'react';
import { ChatContext } from '../../../store/chat.context';
import { getChatsByUserId } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button/Button';

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
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    /*navigate(`/chats/${chat.id}`);*/
  };

  return (
    <div className='bg-gray-800 p-4'>
      <br />
      {chats && chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id} onClick={() => handleChatClick(chat)}>
            <button>{chat.title}</button>
          </div>
        ))
      ) : (
        <div>
          <p>No chats yet. Click below to start your first chat: </p>
          <br />
        </div>
      )}
      <br />
      <Button onClick={handleNewChat}>Start a new chat</Button>
    </div>
  );
};
