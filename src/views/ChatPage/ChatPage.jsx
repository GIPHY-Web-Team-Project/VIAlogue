import React, { useContext, useEffect } from 'react';
import { ChatContext } from '../../store/chat.context';
import { AppContext } from '../../store/app-context';
// import { ChatList } from '../../components/Channels/ChatList/ChatList';
import { ChatWindow } from '../../components/Channels/ChatWindow/ChatWindow';
import { useState } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import LandingPage from '../LandingPage/main/LandingPage';
import CreateChat from '../../components/Channels/CreateChat/CreateChat';
// import { ParticipantsTab } from '../../components/ParticipantsTab/ParticipantsTab';

export const ChatPage = () => {
  const { userData } = useContext(AppContext);
  const { selectedChat, setSelectedChat, chats } = useContext(ChatContext);
  const [participants, setParticipants] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if (!userData || !chats) return;

    const lastChatId = localStorage.getItem(`lastOpenedChat_${userData.uid}`);

    if (lastChatId) {
      const lastChat = chats.find((chat) => chat.id === lastChatId);
      if (lastChat) {
        setSelectedChat(lastChat);
        setParticipants(lastChat.users);
        setShowNewChat(false);
        return;
      }
    }

    const userChats = chats.filter((chat) => chat.users.some((user) => user === userData.username));

    if (userChats.length > 0) {
      setSelectedChat(userChats[0]);
      localStorage.setItem(`lastOpenedChat_${userData.uid}`, userChats[0].id);
      setParticipants(userChats[0].users);
      setShowNewChat(false);
    }
  }, [chats, userData]);

  useEffect(() => {
    if (selectedChat && userData) {
      localStorage.setItem(`lastOpenedChat_${userData.uid}`, selectedChat.id);
      setParticipants(selectedChat.users);
      setShowNewChat(false);
    }
  }, [selectedChat, userData]);

  const handleNewChat = () => {
    console.log('Create button clicked!');
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
          <SideBar type='channels' username={userData?.username} handleNewChat={handleNewChat} />
          {showNewChat ? (
            <CreateChat setShowNewChat={setShowNewChat} showNewChat={showNewChat} />
          ) : (
            <>
              {selectedChat ? (
                <>
                  <ChatWindow selectedChat={selectedChat} participants={participants} setSelectedChat={setSelectedChat} />
                </>
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
