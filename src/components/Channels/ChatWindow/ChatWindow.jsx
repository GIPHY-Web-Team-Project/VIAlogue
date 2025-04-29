import React, { useContext, useRef } from 'react';
import { AppContext } from '../../../store/app-context';
import { MessageWindow } from '../MessageWindow/MessageWindow';
import { getMessagesByChatId } from '../../../services/message.services';
import { useEffect, useState } from 'react';
import SingleMessage from '../SingleMessage/SingleMessage';
import { useNavigate } from 'react-router-dom';
import { updateChat } from '../../../services/chat.services';
import ChatParticipants from '../ChatParticipants/ChatParticipants';
import EditChat from '../EditChat/EditChat';
import PropTypes from 'prop-types';
import membersImg from '../../../../public/images/members.png';

/**
 * ChatWindow component renders the chat interface for a selected chat.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.selectedChat - The currently selected chat object.
 * @param {Array} props.participants - The list of participants in the chat.
 * @param {Function} props.setSelectedChat - Function to update the selected chat.
 *
 * @returns {JSX.Element} The rendered ChatWindow component.
 *
 * @description
 * - Displays the chat messages, participants, and chat title.
 * - Allows editing the chat title and leaving the chat.
 * - Automatically scrolls to the latest message when new messages are added.
 * - Handles loading state while fetching messages.
 */
export const ChatWindow = ({ selectedChat, participants, setSelectedChat, setParticipants }) => {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [edit, setEdit] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showParticipantsText, setShowParticipantsText] = useState(false);
  
  useEffect(() => {
    if (!selectedChat) return;
    console.log('Updating messages for chat:', selectedChat.id);
    setLoading(true);

    const unsubscribe = getMessagesByChatId(selectedChat.id, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedChat]);

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

  /**
   * Handles the logic for leaving a chat.
   *
   * This function performs the following actions:
   * 1. Removes the current user from the list of users in the selected chat.
   * 2. Updates the chat data on the server to reflect the changes.
   * 3. If no users remain in the chat, marks the chat as deleted.
   * 4. Removes the last opened chat reference from local storage.
   * 5. Resets the selected chat state and navigates the user back to the chats page.
   *
   * @async
   * @function handleLeaveChat
   * @returns {Promise<void>} Resolves when the chat leave process is complete.
   */
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
      <div className='flex flex-col w-full  justify-between'>
        <div>
          {selectedChat && (
            <div className='flex flex-row justify-between border-b-2 border-black shadow-2xl'>
              <div className='w-full' onMouseEnter={() => setEditTitle(true)} onMouseLeave={() => setEditTitle(false)}>
                {!edit && (
                  <h1 className='text-2xl mb-4 pb-2 '>
                    {selectedChat.title}
                    {editTitle && (
                      <button className='text-gray-400 hover:text-blue px-1 flex-row' onClick={handleEditTitle}>
                        &#128393;
                      </button>
                    )}
                  </h1>
                )}
                {edit && <EditChat chat={selectedChat} onCancel={() => setEdit(false)} setSelectedChat={setSelectedChat} />}
              </div>
              <div className='flex flex-col'>
                <div onMouseEnter={() => setShowParticipantsText(true)} onMouseLeave={() => setShowParticipantsText(false)} className='relative flex items-center'>
                  <img src={membersImg} alt='Members' className='w-15 h-12 pr-2 cursor-pointer' onClick={toggleShowParticipants} />
                  {showParticipantsText && <span className='absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap z-[9999] shadow-lg mt-1'>Members</span>}
                </div>
                {showParticipants && <ChatParticipants participants={participants} setParticipants={setParticipants} handleLeaveChat={handleLeaveChat} selectedUser={selectedUser} setSelectedUser={setSelectedUser} chatId={selectedChat.id} />}
              </div>
            </div>
          )}
          <div className='flex flex-col overflow-y-auto h-[80vh] pb-4'>
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue'></div>
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
        <MessageWindow chatId={selectedChat.id} sender={userData?.username || 'Unknown'} />
      </div>
    );
  }
};

export default ChatWindow;

ChatWindow.propTypes = {
  selectedChat: PropTypes.object,
  participants: PropTypes.array,
  setSelectedChat: PropTypes.func,
  setParticipants: PropTypes.func,
};
