import React, { useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { ChatContext } from '../../../store/chat.context';
import { createChat } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Modal/Modal';
import SelectUsers from '../../SelectUsers/SelectUsers';
import Button from '../../Button/Button';
import TitleInput from '../../TitleInput/TitleInput';

export const CreateChat = () => {
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

    try {
      await createChat(chatUsers, chatTitle, (chatId) => {
        setSelectedChat({ id: chatId, chatUsers });
        navigate(`/chats/${chatId}`);
      });
    } catch {
      console.error('Error creating chat');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg relative'>
      <h3 className='text-2xl'>Create chat</h3>
      <TitleInput />
      <label htmlFor='title'>Title </label>
      <input type='text' id='title' placeholder='Enter title' />
      <br /> <br />
      <SelectUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      <br /> <br />
      <Button onClick={handleCreateChat}>Create Chat</Button>
      <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default CreateChat;
