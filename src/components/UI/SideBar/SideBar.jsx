import { useNavigate } from 'react-router';
import { ChatList } from '../../Channels/ChatList/ChatList';
import Button from '../Button/Button';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';

export default function SideBar({ type, username, handleNewChat, chats, setChats, setSelectedChat }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full bg-gray-700 p-4'>
        <div className='flex flex-col gap-4'>
          <Button onClick={() => navigate('/teams')}>Teams</Button>
          <Button onClick={() => navigate('/chats')}>Chats</Button>
        </div>
        <Button onClick={() => navigate(`/profile/${userData.username}`)}>Profile</Button>
      </div>
    );
  } else if (type === 'channels') {
    return <ChatList username={username} handleNewChat={handleNewChat} chats={chats} setChats={setChats} setSelectedChat={setSelectedChat} />;
  }
}
