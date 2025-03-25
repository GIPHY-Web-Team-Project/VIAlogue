import React, { useContext, useEffect, useState } from 'react';
import { CHAT_TEAM_LIST_ITEM, NONE } from '../../../common/enums';
import { getChatsByUsername } from '../../../services/chat.services';
import { AppContext } from '../../../store/app-context';
import Button from '../../UI/Button/Button';
import PropTypes from 'prop-types';
import { markMessagesAsRead } from '../../../services/message.services';
import { formatDateShort } from '../../../utils/dateUtils';
import newMessageSound from '/new-message.mp3';

/**
 * ChatList component displays a list of chat conversations for a given user.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.username - The username of the current user.
 * @param {Function} props.handleNewChat - Callback function to handle the creation of a new chat.
 * @param {Array} props.chats - Array of chat objects to be displayed.
 * @param {Function} props.setChats - Function to update the list of chats.
 * @param {Function} props.setSelectedChat - Function to set the currently selected chat.
 *
 * @returns {JSX.Element} The rendered ChatList component.
 */
export const ChatList = ({ username, handleNewChat, chats, setChats, setSelectedChat }) => {
  const { userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [prevUnreadCounts, setPrevUnreadCounts] = useState({});
  const audio = new Audio(newMessageSound);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getChatsByUsername(username, (fetchedChats) => {
      setChats((prevChats) => {
        if (JSON.stringify(prevChats) !== JSON.stringify(fetchedChats)) {
          return [...fetchedChats];
        }
        return prevChats;
      });
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [username]);

  useEffect(() => {
    if (chats) {
      chats.forEach((chat) => {
        if (prevUnreadCounts[chat.id] !== undefined && chat.unreadCount > (prevUnreadCounts[chat.id] || 0)) {
          audio.play();
        }
      });
  
      setPrevUnreadCounts(
        chats.reduce((acc, chat) => {
          acc[chat.id] = chat.unreadCount;
          return acc;
        }, {})
      );
    }
  }, [chats]);

  const handleChatClick = (chat) => {
    markMessagesAsRead(chat.id, username);
    setSelectedChat({ ...chat }); 
    setSelectedChatId(chat.id);
    setChats((prevChats) =>
      prevChats.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  };



  return (
    <div className='bg-gray-800 p-4 overflow-y-auto w-80'>
      <div className='flex flex-row justify-between border-b-2 border-gray-600 mb-2'>
        <h3 className="flex flex-row mb-2">Chat</h3>
      <Button btnStyle={NONE} onClick={() => handleNewChat()}>
          <img src="/images/newchat.jpg" alt="New chat" className="w-7 h-7 ml-2 mb-2 cursor-pointer"/>
      </Button>
      </div>
      <div className="flex flex-col overflow-y-auto h-[90vh] pb-4">
      {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          </div>
        ) : chats && chats.length > 0 ? (
          chats.map((chat) => {
            const isSelected = chat.id === selectedChatId;
            return (
              <div key={chat.id} onClick={() => handleChatClick(chat)}
              className={`p-2 rounded-md cursor-pointer border-gray-600 hover:bg-gray-600 
                ${isSelected ? 'bg-gray-700 text-white' : 'bg-gray-800'}`}
            >
                <div className='flex flex-row justify-between'>
                  <Button btnStyle={CHAT_TEAM_LIST_ITEM}>{chat.title}</Button>
                  {chat.latestMessage && <p className="text-xs text-gray-500">{formatDateShort(chat.latestMessage.createdOn)}</p>}
                </div>
                <div className='flex flex-row justify-between'>
                {chat.latestMessage ? (
                  <p className="text-sm text-gray-500 overflow-ellipsis overflow-hidden flex flex-row">
                    <strong>{(chat.latestMessage.sender !== userData.username) ? (chat.latestMessage.sender) : "You"}: </strong> &nbsp;{chat.latestMessage.message}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No messages yet</p>
                )}
                {chat.unreadCount > 0 && (
                <h5 className="bg-gray-950 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                </h5>
                )}
                </div>
              </div>
            )
          })
        ) : (
          <div>
            <p>No chats yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;

ChatList.propTypes = {
  username: PropTypes.string,
  handleNewChat: PropTypes.func,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  setSelectedChat: PropTypes.func,
}
