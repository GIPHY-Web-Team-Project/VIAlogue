import React, { useEffect, useContext } from 'react';
import { getChatsByUsername } from '../../../services/chat.services';
import Button from '../../UI/Button/Button';
import { CHAT_TEAM_LIST_ITEM, NONE } from '../../../common/enums';
import { AppContext } from '../../../store/app-context';

export const ChatList = ({ username, handleNewChat, chats, setChats, setSelectedChat }) => {
  const { userData } = useContext(AppContext); 

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
      <Button btnStyle={NONE} onClick={() => handleNewChat()}>
          <img src="/images/newchat.jpg" alt="New chat" className="w-7 h-7 ml-2"/>
      </Button>
      </div>
      {chats && chats.length > 0 ? (
        chats.map((chat) => {
          return (
            <div key={chat.id} onClick={() => handleChatClick(chat)} >
              <Button btnStyle={CHAT_TEAM_LIST_ITEM}>{chat.title}</Button>
              {chat.latestMessage ? (
                <p className="text-sm text-gray-400 overflow-ellipsis overflow-hidden flex flex-row">
                  <strong>{(chat.latestMessage.sender !== userData.username) ? (chat.latestMessage.sender) : "You"}: </strong> &nbsp;{chat.latestMessage.message}
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
