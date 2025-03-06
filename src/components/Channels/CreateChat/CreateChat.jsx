import React, { useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { ChatContext } from '../../../store/chat.context';
import { createChat } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Modal/Modal';
import SearchBar from '../../SearchBar/SearchBar';
import SelectUsers from '../../SelectUsers/SelectUsers';
import { titleCheck } from '../../../utils/chatUtils';

export const CreateChat = ( setShowNewChat, showNewChat) => {
  const { userData } = useContext(AppContext);
  const { setSelectedChat } = useContext(ChatContext);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([userData]);
  const [showModal, setShowModal] = useState(false);

  const handleCreateChat = async () => {
    const chatUsers = selectedUsers.map((user) => user);

    if (chatUsers.length < 2) {
      setModalMessage('Please select at least 2 users to create a chat');
      setShowModal(true);
      return;
    }

    const chatTitle = document.getElementById('title').value.toLowerCase();

    if (chatTitle === '') {
      setModalMessage('Please enter a chat title.');
      setShowModal(true);
      return;
    }

    titleCheck(chatTitle);

    try {
      await createChat(chatUsers, chatTitle, (chatId) => {
        setSelectedChat({ id: chatId, chatUsers });
        setShowNewChat(!showNewChat);
        navigate(`/chats`);
      });
    } catch {
      console.log('Error creating chat');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <div className="shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Start a New Chat</h2>
        
        <div className="w-full">
          <label htmlFor="title" className="block text-sm font-medium text-gray-600">Chat Title</label>
          <input 
            type="text" 
            id="title" 
            placeholder="Enter title" 
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="w-full mt-4 justify-between">
          <SelectUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
        </div>

        <button 
          onClick={handleCreateChat} 
          className="mt-4 w-full btn"
        >
          Create Chat
        </button>
      </div>

      {showModal && (
        <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CreateChat;
