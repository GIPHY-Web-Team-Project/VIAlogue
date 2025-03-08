import { useNavigate } from 'react-router';
import { ChatList } from '../Channels/ChatList/ChatList';
import Button from '../Button/Button';

export default function SideBar({ type, userId }) {
  const navigate = useNavigate();

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full w-32 bg-gray-700 flex-col p-4'>
        <div className='flex flex-col gap-4'>
          <Button onClick={() => navigate('/teams')}>Teams</Button>
          <Button onClick={() => navigate('/chats')}>Chats</Button>
        </div>
        <Button onClick={() => navigate('/profile')}>Profile</Button>
      </div>
    );
  } else if (type === 'channels') {
    return <ChatList userId={userId} />;
  } else if (type === 'users') {
    return (
      <div>
        <button>Participants</button>
        {/* {participants && <ChatParticipatns/>} */}
      </div>
    );
  }
}
