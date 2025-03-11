import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { getUserByUsername } from '../../../services/user.service';
import { useNavigate } from 'react-router-dom';

export const ChatParticipants = ({ participants, handleLeaveChat, selectedUser, setSelectedUser }) => {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showLeave, setShowLeave] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
  }, [participants]);

  const handleProfileView = (user) => {
    navigate(`/${user.username}`);
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

  return (
    <div className='absolute top-30 right-0 bg-gray-800 text-white z-50 shadow-lg overflow-y-auto border border-gray-600'>
      <ul>
        {users.map((user) => (
          <li key={user.username} className='p-2 hover:bg-gray-700 cursor-pointer'>
            <div className='flex flex-row'>
              <span>
                <img className='mr-2 h-5 w-5 rounded-full overflow-hidden bg-gray-100' src={user.profilePicture} alt={user.username} />
              </span>
              <span onClick={() => handleUserClick(user.username)} className='mr-2'>
                {user.username}
              </span>
              {userData.username === user.username && showLeave && (
                <button onClick={handleLeaveChat} className='text-gray-500 text-xs'>
                  Leave
                </button>
              )}
              {selectedUser === user.username && selectedUser !== userData.username && showProfile && (
                <>
                  <button onClick={() => handleProfileView(user)} className='text-gray-500 text-xs'>
                    View profile
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatParticipants;
