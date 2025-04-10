import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { getUserByUsername } from '../../../services/user.service';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import { CHAT_PARTICIPANTS_BTNS } from '../../../common/enums';
import { useUsers } from '../../../hooks/useUsers';
import { updateChat } from '../../../services/chat.services';
import SelectUsersTeamChat from '../../SelectUsers/SelectUsersTeamChat/SelectUsersTeamChat';
import ViewStatus from '../../../views/ViewStatus/ViewStatus';
import PropTypes from 'prop-types';
import Modal from '../../UI/Modal/Modal';
// import defaultAvatar from '../../../../public/images/123.jpg';
// import addPeople from '../../../../public/images/add-people.png';

/**
 * ChatParticipants component displays a list of chat participants and provides functionality
 * to view profiles, leave the chat, and add new participants. It manages the state of selected
 * users, users not in the chat, and visibility of various UI elements.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<string>} props.participants - List of usernames of current chat participants.
 * @param {Function} props.handleLeaveChat - Callback function to handle leaving the chat.
 * @param {string} props.selectedUser - The currently selected user.
 * @param {Function} props.setSelectedUser - Function to update the selected user.
 * @param {string} props.chatId - The ID of the current chat.
 * @returns {JSX.Element} The rendered ChatParticipants component.
 */
export const ChatParticipants = ({ participants, setParticipants, handleLeaveChat, selectedUser, setSelectedUser, chatId }) => {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showLeave, setShowLeave] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSelectUsers, setShowSelectUsers] = useState(false);
  const [usersNotInChat, setUsersNotInChat] = useState([]);
  const { users: allUsers } = useUsers(userData);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await Promise.all(
        participants.map(async (username) => {
          return await getUserByUsername(username);
        })
      );
      setUsers(userList);
    };

    fetchUsers();

    const fetchUsersNotInChat = () => {
      if (allUsers && userData) {
        const availableUsers = allUsers.filter((user) => user.username !== userData.username).filter((user) => !participants.includes(user.username));
        setUsersNotInChat(availableUsers);
      }
    };

    fetchUsersNotInChat();
  }, [participants, userData, allUsers]);

  const handleProfileView = (user) => {
    navigate(`/profile/${user.username}`);
  };

  const handleUserClick = (user) => {
    if (user === userData.username) {
      setShowLeave(!showLeave);
      setShowProfile(false);
    } else {
      setSelectedUser(user);
      setShowProfile(!showProfile);
      setShowLeave(false);
    }
  };

  /**
   * Toggles the visibility of the user selection interface and updates the list of users not in the chat.
   * If the list of users not in the chat is empty, it populates it with users who are not the current user
   * and are not already participants in the chat.
   *
   * @function toggleSelectUsers
   * @returns {void}
   */
  const toggleSelectUsers = () => {
    setShowSelectUsers(!showSelectUsers);
    if (usersNotInChat.length === 0) {
      const userList = users.filter((user) => user.username !== userData.username && !participants.includes(user.username));
      setUsersNotInChat(userList);
    }
  };

  /**
   * Handles adding new users to the chat by merging selected users with existing participants
   * and updating the chat data.
   *
   * @async
   * @function handleNewUsers
   * @returns {Promise<void>} Resolves when the chat is successfully updated.
   * @throws {Error} Logs an error to the console if the chat update fails.
   */
  const handleNewUsers = async () => {
    const newUsers = selectedUsers.map((user) => user);
    try {
      await updateChat(chatId, [...participants, ...newUsers], 'users');
      setSelectedUsers([]);
      const userList = await Promise.all(
        newUsers.map(async (username) => {
          return await getUserByUsername(username);
        })
      );
      setUsers([...users, ...userList]);
      setParticipants([...participants, ...newUsers]);
      setUsersNotInChat(usersNotInChat.filter((user) => !newUsers.includes(user.username)));
    } catch (error) {
      console.log(error);
      setModalMessage(`New users could not be added. Please try again!`);
      setShowModal(true);
    }
  };

  return (
    <div className='absolute top-12 right-5 bg-gray-800 text-white z-50 shadow-lg overflow-y-auto border border-gray-600 max-h-[60vh]'>
      <ul className='max-h-screen'>
        {users.map((user) => (
          <li key={user.uid || user.username} className='p-2 hover:bg-gray-700 cursor-pointer'>
            <div className='flex flex-row'>
              <ViewStatus username={user.username} type={'participants'} source='chat-participants' />
              <span className='content-center'>
                <img className='mr-2 h-5 w-5 rounded-full overflow-hidden bg-gray-100' src={user.profilePicture || '../../../../public/images/123.jpg'} alt={user.username} />
              </span>
              <span onClick={() => handleUserClick(user.username)} className='mr-2 text-s'>
                {user.username}
              </span>
              {userData.username === user.username && showLeave && (
                <Button btnStyle={CHAT_PARTICIPANTS_BTNS} onClick={handleLeaveChat}>
                  Leave
                </Button>
              )}
              {selectedUser === user.username && selectedUser !== userData.username && showProfile && (
                <>
                  <Button btnStyle={CHAT_PARTICIPANTS_BTNS} onClick={() => handleProfileView(user)}>
                    View profile
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className='h-auto bottom-auto'>
        <button className='text-s flex flex-wrap place-content-center p-2 cursor-pointer border-t-2 border-gray-700 w-full' onClick={toggleSelectUsers}>
          Add people &nbsp; <img src='../../../../public/images/add-people.png' className='h-5 w-5 flex justify-self-center align-center' />
        </button>
        {showSelectUsers && (
          <div className='mt-4 h-auto'>
            <SelectUsersTeamChat selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} userList={usersNotInChat} setUserList={setUsersNotInChat} />
            <button onClick={handleNewUsers} className='mt-2 w-full mb-2 border-t-2 border-gray-700 p-2 cursor-pointer'>
              Add to chat
            </button>
          </div>
        )}
      </div>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
};

export default ChatParticipants;

ChatParticipants.propTypes = {
  participants: PropTypes.array.isRequired,
  setParticipants: PropTypes.func.isRequired,
  handleLeaveChat: PropTypes.func.isRequired,
  selectedUser: PropTypes.string,
  setSelectedUser: PropTypes.func.isRequired,
  chatId: PropTypes.string,
};
