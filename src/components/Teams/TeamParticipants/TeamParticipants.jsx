import { useNavigate } from 'react-router';
import ViewStatus from '../../../views/ViewStatus/ViewStatus';
import React from 'react';
import PropTypes from 'prop-types';

export default function TeamParticipants({ users }) {
  const navigate = useNavigate();

  const handleProfileView = (user) => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <ul className='bg-gray-800 min-w-max'>
      {users.map((user) => (
        <li key={user.uid || user.username} className='p-2 hover:bg-gray-700 cursor-pointer'>
          <div className='flex flex-row'>
            <span>
              <img className='mr-2 h-5 w-5 rounded-full overflow-hidden bg-gray-100' src={user.profilePicture || '../../../../public/images/123.jpg'} alt={user.username} />
            </span>
            <p onClick={() => handleProfileView(user)}>{user.username}</p>
            <ViewStatus username={user.username} type={'participants'} />
          </div>
        </li>
      ))}
    </ul>
  );
}

TeamParticipants.propTypes = {
  users: PropTypes.array.isRequired,
};
