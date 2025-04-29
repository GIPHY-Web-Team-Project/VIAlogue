import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../store/app-context';
import { ChatWindow } from '../../components/Channels/ChatWindow/ChatWindow';
import { useState } from 'react';
import SideBar from '../../components/UI/SideBar/SideBar';
import LandingPage from '../LandingPage/main/LandingPage';
import CreateChat from '../../components/Channels/CreateChat/CreateChat';

/**
 * ChatPage component renders the main chat interface for the application.
 * It manages the state of the selected chat, available chats, participants, 
 * and the visibility of the new chat creation interface.
 *
 * @component
 * @returns {JSX.Element} The rendered ChatPage component.
 *
 * @description
 * - If the user is not logged in (`userData` is null), it redirects to the LandingPage.
 * - Displays a sidebar for navigation and chat channels.
 * - Allows users to create a new chat or select an existing chat.
 * - Persists the last opened chat in localStorage for each user.
 *
 * @hook useContext(AppContext) - Accesses the global application context to retrieve user data.
 * @hook useState - Manages local state for selected chat, chats, participants, and new chat visibility.
 * @hook useEffect - Handles side effects for initializing chats and persisting the last opened chat.
 *
 * @state {Object|null} selectedChat - The currently selected chat object or null if no chat is selected.
 * @state {Array|null} chats - The list of available chats or null if not loaded.
 * @state {Array} participants - The list of participants in the selected chat.
 * @state {boolean} showNewChat - Indicates whether the new chat creation interface is visible.
 *
 */
export const ChatPage = () => {
  const { userData, selectedChat, setSelectedChat } = useContext(AppContext);
  const [chats, setChats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if (!userData || !chats || selectedChat) return;

    const lastChatId = localStorage.getItem(`lastOpenedChat_${userData.uid}`);
    const lastChat = lastChatId ? chats.find((chat) => chat.id === lastChatId) : null;

    if (lastChat) {
      setSelectedChat({ ...lastChat });
      setParticipants(lastChat.users);
      setShowNewChat(false);
    } else {
      const userChats = chats.filter((chat) => chat.users.includes(userData.username));
      if (userChats.length > 0) {
        setSelectedChat({ ...userChats[0] });
        localStorage.setItem(`lastOpenedChat_${userData.uid}`, userChats[0].id);
        setParticipants(userChats[0].users);
        setShowNewChat(false);
      }
    }
  }, [chats, userData]);

  useEffect(() => {
    if (selectedChat) {
      setParticipants(selectedChat.users);
      localStorage.setItem(`lastOpenedChat_${userData.uid}`, selectedChat.id);
    }
  }, [selectedChat]);

  const handleNewChat = () => {
    setShowNewChat(!showNewChat);
    setSelectedChat(null);
  };

  if (!userData) {
    return <LandingPage />;
  }

  if (userData) {
    return (
      <div className='flex flex-grow'>
        <SideBar type='menu' />
        <div className='flex flex-grow justify-between'>
          <SideBar type='channels' username={userData?.username} handleNewChat={handleNewChat} chats={chats} setChats={setChats} setSelectedChat={setSelectedChat} />
          {showNewChat ? (
            <CreateChat setShowNewChat={setShowNewChat} showNewChat={showNewChat} setSelectedChat={setSelectedChat} />
          ) : (
            <>
              {selectedChat ? (
                <div className='bg-gray-800 flex flex-col w-full h-full justify-between p-4'>
                  <ChatWindow selectedChat={selectedChat} participants={participants} setSelectedChat={setSelectedChat} setParticipants={setParticipants}/>
                </div>
              ) : (
                <p>Select a chat to start messaging.</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default ChatPage;
