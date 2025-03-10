import React, { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { MessageWindow } from '../MessageWindow/MessageWindow';
import { getMessagesByChatId } from '../../../services/message.services';
import { useEffect, useState } from 'react';
import SingleMessage from '../SingleMessage/SingleMessage';
import { useNavigate } from 'react-router-dom';
import { updateChat } from '../../../services/chat.services';
import ChatParticipants from '../ChatParticipants/ChatParticipants';

export const ChatWindow = ({ selectedChat, participants, setSelectedChat }) => {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedChat?.id) {
      return;
    }
    const unsubscribe = getMessagesByChatId(selectedChat?.id, setMessages);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedChat.id]);

  const toggleShowParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  const handleLeaveChat = async () => {
    const updatedUsers = selectedChat.users.filter((user) => user !== userData.username);
    await updateChat(selectedChat.id, { users: updatedUsers });

    if (updatedUsers.length === 0) {
      await updateChat(selectedChat.id, { isDeleted: true });
    }

    localStorage.removeItem(`lastOpenedChat_${userData.uid}`);
    setSelectedChat(null);
    navigate('/chats');
  };

  const handleUserClick = (username) => {
    if (userData.username === username) {
      setShowLeave(!showLeave);
    }
    if (userData.username !== username) {
      navigate(`/users/${username}`);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  if (!selectedChat) {
    return <p>Select a chat to start messaging.</p>;
  }

  if (selectedChat) {
    return (
      <div className='flex flex-col w-full bg-transparent justify-between m-4'>
        <div>
          {selectedChat && (
            <div className='flex flex-row justify-between'>
              <div className='w-full'>
                <h1 className='text-2xl border-b-2 mb-4 pb-2 border-black shadow-2xl'>{selectedChat.title}</h1>
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <img src='/images/members.jpg' alt='Members' className='w-8 h-8 pr-2' onClick={toggleShowParticipants} />
                {showParticipants && <ChatParticipants participants={participants} handleLeaveChat={handleLeaveChat} handleUserClick={handleUserClick} showLeave={showLeave} />}
              </div>
            </div>
          )}
          <div className='flex flex-col overflow-y-auto'>
            {messages ? (
              messages.map((messageObj, index) => {
                const isFirstFromSender = index === 0 || messages[index - 1].sender !== messageObj.sender;
                return (
                  <div key={messageObj.id}>
                    <SingleMessage key={messageObj.id} msg={messageObj} isFirstFromSender={isFirstFromSender} />
                  </div>
                );
              })
            ) : (
              <p>No messages yet. Start typing and send your first message.</p>
            )}
          </div>
        </div>
        <MessageWindow chatId={selectedChat.id} sender={userData?.username || 'Unknown'} />
      </div>
    );
  }
};

export default ChatWindow;
