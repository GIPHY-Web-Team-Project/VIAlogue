import { useContext } from 'react';
import { AppContext } from '../../store/app-context';
import { useNavigate } from 'react-router';
import SideBar from '../../components/SideBar/SideBar';

// use subscribe / unsubscribe logic from forum CommentSection to show all teams
//

export default function TeamsTab() {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <p className='text-gray-400 mt-6'>
          Click here to{' '}
          <button onClick={() => navigate('/login')} className='text-blue-500 cursor-pointer hover:underline'>
            Login
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-grow'>
      <SideBar type='menu' />
      <div>
        <h1>{user && userData?.username}</h1>
        <button className='btn'>Create a Team</button>
      </div>
    </div>
  );
}
