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
  const navigate = useNavigate();
  const [showLeave, setShowLeave] = useState(false);

  useEffect(() => {
    if (!selectedChat?.id) {
      console.warn('Chat ID is undefined!');
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
    const updatedUsers = selectedChat.users.filter((user) => user.uid !== userData.uid);
    await updateChat(selectedChat.id, { users: updatedUsers });

    if (updatedUsers.length === 0) {
      await updateChat(selectedChat.id, { isDeleted: true });
    }

    localStorage.removeItem(`lastOpenedChat_${userData.uid}`);
    setSelectedChat(null);
    navigate('/chats');
  };

  const handleUserClick = (userUID) => {
    if (userData.uid === userUID) {
      setShowLeave(!showLeave);
    }
    if (userData.uid !== userUID) {
      navigate(`/users/${userUID}`);
    }
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  if (!selectedChat) {
    return <p>Select a chat to start messaging.</p>;
  }

  if (selectedChat) {
    return (
      <div className="flex flex-col w-full bg-transparent justify-between m-4">
        <div>
        {selectedChat && <h1 className="flex flex-row justify-between text-2xl border-b-2 mb-4 pb-2 border-black shadow-2xl">{selectedChat.title}
          <div>
            <img src="/images/members.jpg" alt="Members" className="w-8 h-8 pr-2" onClick={toggleShowParticipants} />
            {showParticipants && (
              <ChatParticipants participants={participants} handleLeaveChat={handleLeaveChat} handleUserClick={handleUserClick} showLeave={showLeave} />
            )}
          </div>
        </h1>}
        <div className="flex flex-col overflow-y-auto">
          {messages ? (
            messages.map((messageObj, index) => {
              const isFirstFromSender = index === 0 || messages[index - 1].sender !== messageObj.sender;
              return (
              <div key={messageObj.id}>
                <SingleMessage key={messageObj.id} msg={messageObj} isFirstFromSender={isFirstFromSender}/>
              </div>
            )})
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
