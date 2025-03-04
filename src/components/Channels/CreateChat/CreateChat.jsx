import React, { useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { ChatContext } from '../../../store/chat.context';
import { createChat } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../hooks/useUsers';
import Modal from '../../Modal/Modal';
import { useEffect } from 'react';
import SearchBar from '../../SearchBar/SearchBar';

export const CreateChat = () => {
  const { userData } = useContext(AppContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [selectedUsers, setSelectedUsers] = useState([userData]);
  const navigate = useNavigate();
  const { users } = useUsers(userData);
  const [userList, setUserList] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (users && userList.length !== users.length) {
      const usersWithoutLoggedIn = users.filter((user) => user.username !== userData.username);
      setUserList(usersWithoutLoggedIn);
    }
  }, [users]);

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user]);
    setUserList((prevList) => prevList.filter((u) => u.username !== user.username));
  };

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
      console.log('Error creating chat');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.username !== user.username));
  };

  return (
    <div>
      <h2>Start a new chat</h2>
      <label htmlFor='title'>Title </label>
      <input type='text' id='title' placeholder='Enter title' />
      <br />
      <br />
      <SearchBar type='users' objects={users} objectList={userList} setObjectList={setUserList} />
      <br />
      <br />
      <h3>Selected users</h3>
      <ul>
        {selectedUsers.map((user) => (
          <div key={user.username}>
            <li>
              <span>
                {user.username} ({user.email})
              </span>
              <button onClick={() => handleRemove(user)} className='btn'>
                Remove
              </button>
            </li>
          </div>
        ))}
      </ul>
      <br />
      <br />
      <h3>Users to choose from:</h3>
      <ul>
        {userList.map((user) => (
          <div key={user.uid}>
            <li>
              <span>
                {user.username} ({user.email})
              </span>
              <button onClick={() => handleUserSelect(user)} className='btn'>
                Select
              </button>
            </li>
          </div>
        ))}
      </ul>
      <br />
      <br />
      <br />
      <button onClick={handleCreateChat} className='btn'>
        Create Chat
      </button>
      <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default CreateChat;
