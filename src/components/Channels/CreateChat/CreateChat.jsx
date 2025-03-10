import React, { useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { ChatContext } from '../../../store/chat.context';
import { createChat } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Modal/Modal';
import SelectUsers from '../../SelectUsers/SelectUsers';
import Button from '../../Button/Button';
import { titleCheck } from '../../../utils/chatUtils';
import TitleInput from '../../TitleInput/TitleInput';

export const CreateChat = (setShowNewChat, showNewChat) => {
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
      console.error('Error creating chat');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='flex justify-between w-full h-full flex-col'>
      <div className='shadow-lg rounded-lg p-6 w-full'>
        <div>
          <label htmlFor='title'> </label>
          <input type='text' id='title' placeholder='Enter chat title' className='mt-1 w-full pb-2 border-b focus:ring-2 focus:ring-blue-500 outline-none' />
        </div>

        <div className='mt-8'>
          <SelectUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
        </div>

        <button onClick={handleCreateChat} className='mt-4 w-full'>
          Create Chat
        </button>
      </div>

      {showModal && <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />}
    </div>
  );
};

export default CreateChat;
