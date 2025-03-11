import React, { useEffect } from 'react';
import { getChatsByUsername } from '../../../services/chat.services';
import Button from '../../UI/Button/Button';
import { CHAT_TEAM_LIST_ITEM, NONE } from '../../../common/enums';

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
    <div className='bg-gray-800 p-4 overflow-y-auto'>
      <h3 className='flex flex-row border-b-2 mb-2 pb-3'>
        Chat
        <Button btnStyle={NONE} onClick={() => handleNewChat()}>
          <img src='/images/newchat.jpg' alt='New chat' className='w-7 h-7 ml-2' />
        </Button>
      </h3>
      {chats && chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id}>
            <Button btnStyle={CHAT_TEAM_LIST_ITEM} onClick={() => handleChatClick(chat)}>
              {chat.title}
            </Button>
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
