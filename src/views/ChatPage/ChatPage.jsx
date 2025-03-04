import React, { useContext, useEffect } from 'react';
import { ChatContext } from '../../store/chat.context';
import { AppContext } from '../../store/app-context';
// import { ChatList } from '../../components/Channels/ChatList/ChatList';
import { ChatWindow } from '../../components/Channels/ChatWindow/ChatWindow';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateChat } from '../../services/chat.services';
import SideBar from '../../components/SideBar/SideBar';
import { ParticipantsTab } from '../../components/ParticipantsTab/ParticipantsTab';

export const ChatPage = () => {
  const { userData } = useContext(AppContext);
  const { selectedChat, setSelectedChat, chats } = useContext(ChatContext);
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    if (!userData || !chats) return;

    const lastChatId = localStorage.getItem(`lastOpenedChat_${userData.uid}`);

    if (lastChatId) {
      const lastChat = chats.find((chat) => chat.id === lastChatId);
      if (lastChat) {
        setSelectedChat(lastChat);
        setParticipants(lastChat.users);
        return;
      }
    }

    const userChats = chats.filter((chat) => chat.users.some((user) => user.uid === userData.uid));

    if (userChats.length > 0) {
      setSelectedChat(userChats[0]);
      localStorage.setItem(`lastOpenedChat_${userData.uid}`, userChats[0].id);
      setParticipants(userChats[0].users);
    }
  }, [chats, userData]);

  useEffect(() => {
    if (selectedChat && userData) {
      localStorage.setItem(`lastOpenedChat_${userData.uid}`, selectedChat.id);
      setParticipants(selectedChat.users);
    }
  }, [selectedChat, userData]);

  const handleLeaveChat = async () => {
    if (!selectedChat || !userData) return;

    const updatedUsers = selectedChat.users.filter((user) => user.uid !== userData.uid);
    await updateChat(selectedChat.id, { users: updatedUsers });

    if (updatedUsers.length === 0) {
      await updateChat(selectedChat.id, { isDeleted: true });
    }

    setSelectedChat(null);
    localStorage.removeItem(`lastOpenedChat_${userData.uid}`);
    navigate('/chats');
  };

  const toggleShowParticipants = () => {
    setShowParticipants(!showParticipants);
  };
  return (
    <div className='flex flex-grow'>
      <SideBar type='menu' />
      <div className='flex flex-grow justify-between'>
        <SideBar type='channels' userId={userData?.uid} />
        {/* <ChatList userId={userData?.uid} /> */}

        {selectedChat ? (
          <>
            <ChatWindow chatId={selectedChat.id} />
            <div>
              <h3>Participants</h3>
              <button className='btn' onClick={toggleShowParticipants} style={{ marginTop: '10px', backgroundColor: 'blue', color: 'white' }}>
                {showParticipants ? 'Hide Participants' : 'Show Participants'}
              </button>
              {showParticipants && <ParticipantsTab participants={participants} selectedObj={selectedChat} handleLeave={handleLeaveChat} />}
            </div>
          </>
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
