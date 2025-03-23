import { useNavigate } from 'react-router';
import Button from '../../UI/Button/Button';
import ViewStatus from '../../../views/ViewStatus/ViewStatus';

export default function TeamParticipants({ users }) {
  const navigate = useNavigate();

  const handleProfileView = (user) => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <ul>
      {users.map((user) => (
        <li key={user.uid || user.username} className='p-2 hover:bg-gray-700 cursor-pointer'>
          <div className='flex flex-row'>
            <span>
              <img className='mr-2 h-5 w-5 rounded-full overflow-hidden bg-gray-100' src={user.profilePicture || '/images/123.jpg'} alt={user.username} />
            </span>
            <Button onClick={() => handleProfileView(user)}>{user.username}</Button>
            <ViewStatus username={user.username} type={'participants'} />
          </div>
        </li>
      ))}
    </ul>
  );
}
