import React from 'react';
import { AppContext } from '../../../store/app-context';
import { useContext } from 'react';

export const ChatParticipants = ({ participants, handleLeaveChat, handleUserClick, showLeave }) => {
  const { userData } = useContext(AppContext);

  return (
    <>
      <ul>
        {participants.map((user) => (
          <li key={user} className='text-xs'>
            <span onClick={() => handleUserClick(user)}>{user}</span>
            {userData.username === user && showLeave && <button onClick={handleLeaveChat}>Leave</button>}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ChatParticipants;
