import { useNavigate } from 'react-router';

export default function SideBar({ type }) {
  const navigate = useNavigate();

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full w-64 bg-gray-800 flex-col p-4'>
        <div className='flex flex-col gap-4'>
          <button onClick={() => navigate('/teams')} className='btn'>
            Teams
          </button>
          <button onClick={() => navigate('/chats')} className='btn'>
            Chats
          </button>
        </div>
        <button onClick={() => navigate('/profile')} className='btn'>
          Profile
        </button>
      </div>
    );
  } else if (type === 'channels') {
    return (
      <div>
        <h1>Here you will see the teams' channels</h1>
      </div>
    );
  } else if (type === 'users') {
    return (
      <div>
        <h1>Here you will see the users</h1>
      </div>
    );
  }
}
