import React, { useContext, useRef } from 'react';
import { AppContext } from '../../../store/app-context';
import { MessageWindow } from '../MessageWindow/MessageWindow';
import { getMessagesByChatId } from '../../../services/message.services';
import { useEffect, useState } from 'react';
import SingleMessage from '../SingleMessage/SingleMessage';
import { useNavigate } from 'react-router-dom';
import { updateChat } from '../../../services/chat.services';
import ChatParticipants from '../ChatParticipants/ChatParticipants';
import { CHANNEL } from '../../../common/enums';
import EditChat from '../EditChat/EditChat';

export const ChatWindow = ({ selectedChat, participants, setSelectedChat }) => {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [edit, setEdit] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedChat?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = getMessagesByChatId(selectedChat, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedChat.id]);

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [messages]);

  const toggleShowParticipants = () => {
    setShowParticipants(!showParticipants);
  };
  const handleLeaveChat = async () => {
    const updatedUsers = selectedChat.users.filter((user) => user !== userData.username);
    await updateChat(selectedChat.id, updatedUsers, 'users');

    if (updatedUsers.length === 0) {
      await updateChat(selectedChat.id, { isDeleted: true });
    }

    localStorage.removeItem(`lastOpenedChat_${userData.uid}`);
    setSelectedChat(null);
    navigate('/chats');
  };

  const handleEditTitle = () => {
    setEdit(true);
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
              <div className='w-full' onMouseEnter={() => setEditTitle(true)} onMouseLeave={() => setEditTitle(false)}>
                <h1 className='text-2xl border-b-2 mb-4 pb-2 border-black shadow-2xl'>
                  {selectedChat.title}
                  {editTitle && (
                    <button className='text-gray-600 hover:text-gray-800 p-1 flex-row' onClick={handleEditTitle}>
                      <img src='/images/edit.png' alt='Edit' className='w-4 h-4' />
                    </button>
                  )}
                </h1>
                {edit && <EditChat chat={selectedChat} onCancel={() => setEdit(false)} />}
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <img src='/images/members.jpg' alt='Members' className='w-8 h-8 pr-2' onClick={toggleShowParticipants} />
                {showParticipants && <ChatParticipants participants={participants} handleLeaveChat={handleLeaveChat} selectedUser={selectedUser} setSelectedUser={setSelectedUser} chatId={selectedChat.id} />}
              </div>
            </div>
          )}
          <div className='flex flex-col overflow-y-auto h-[80vh] pb-4'>
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500'></div>
              </div>
            ) : messages && messages.length > 0 ? (
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
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <MessageWindow chat={selectedChat} sender={userData?.username || 'Unknown'} />
      </div>
    );
  }
};

export default ChatWindow;
