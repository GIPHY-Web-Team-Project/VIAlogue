import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../store/app-context';
import { createChat } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import Modal from '../../UI/Modal/Modal';
import { titleCheck } from '../../../utils/chatUtils';
import { useUsers } from '../../../hooks/useUsers';
import SelectUsersTeamChat from '../../SelectUsers/SelectUsersTeamChat/SelectUsersTeamChat';
import Button from '../../UI/Button/Button';
import PropTypes from 'prop-types';

/**
 * CreateChat component allows users to create a new chat by selecting users and providing a chat title.
 *
 * @param {Function} setShowNewChat - Function to toggle the visibility of the new chat creation modal.
 * @param {boolean} showNewChat - Boolean indicating whether the new chat creation modal is visible.
 * @param {Function} setSelectedChat - Function to set the currently selected chat.
 *
 * @returns {JSX.Element} The CreateChat component.
 *
 * @description
 * This component provides a form for creating a new chat. Users can:
 * - Enter a chat title.
 * - Select users to include in the chat.
 * - Submit the form to create the chat.
 *
 * The component validates the input to ensure:
 * - At least two users are selected.
 * - A chat title is provided.
 *
 * If validation fails, a modal is displayed with an appropriate error message.
 *
 */
export const CreateChat = (setShowNewChat, showNewChat, setSelectedChat) => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([userData.username]);
  const [showModal, setShowModal] = useState(false);
  const { users } = useUsers(userData);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (users) {
      const availableUsers = users
        .filter((user) => user.username !== userData.username)
        .filter((user) => !selectedUsers.includes(user.username));
      setUserList(availableUsers);
    }
  }, [users, selectedUsers]);

  /**
   * Handles the creation of a new chat.
   * 
   * This function validates the selected users and chat title, displays error messages
   * if necessary, and creates a new chat if all conditions are met. Upon successful
   * creation, it navigates to the chats page and updates the selected chat state.
   * 
   * @async
   * @function handleCreateChat
   * @returns {Promise<void>} Resolves when the chat creation process is complete.
   * @throws Will log an error to the console if the chat creation fails.
   */
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

        <div className="mt-8">
          <SelectUsersTeamChat selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} userList={userList} setUserList={setUserList}/>
        </div>

        <Button onClick={handleCreateChat}>Create Chat</Button>
      </div>

      {showModal && <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />}
    </div>
  );
};

export default CreateChat;

CreateChat.propTypes = {
  setShowNewChat: PropTypes.func,
  showNewChat: PropTypes.bool,
  setSelectedChat: PropTypes.func,
};
