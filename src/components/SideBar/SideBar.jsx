import { useNavigate } from 'react-router';
import { ChatList } from '../Channels/ChatList/ChatList';

export default function SideBar({ type, userId, handleNewChat }) {
  const navigate = useNavigate();

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full w-64 bg-gray-700 flex-col p-4'>
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
    return <ChatList userId={userId} handleNewChat={handleNewChat}/>;
  } else if (type === 'users') {
    return (
      <div>
        <button>Participants</button>
        {/* {participants && <ChatParticipatns/>} */}
      </div>
    );
  }
}
