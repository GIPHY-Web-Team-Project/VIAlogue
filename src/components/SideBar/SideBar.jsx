import { NavLink, useNavigate } from 'react-router';
import { ChatList } from '../Channels/ChatList/ChatList';
import Button from '../Button/Button';

export default function SideBar({ type, username, handleNewChat, chats, setChats, setSelectedChat }) {
  const navigate = useNavigate();

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full bg-gray-700 p-2'>
        <div className='flex flex-col gap-4'>
          <NavLink to='/chats' className='text-4xl'><img src="/images/updated-short-dark.png" className="h-15 w-15 flex justify-self-center"/></NavLink>
          <NavLink to='/teams' ><img src="/images/teams.png" className="h-13 w-13 flex justify-self-center"/></NavLink>
          {/* <NavLink to='/chats'><img src="/images/chats.png" className="h-13 w-13 flex justify-self-center"/></NavLink> */}
        </div>
        <Button onClick={() => navigate('/profile')}>Profile</Button>
      </div>
    );
  } else if (type === 'channels') {
    return <ChatList username={username} handleNewChat={handleNewChat} chats={chats} setChats={setChats} setSelectedChat={setSelectedChat}/>;
  } else if (type === 'users') {
    return (
      <div>
        <button>Participants</button>
        {/* {participants && <ChatParticipatns/>} */}
      </div>
    );
  }
}
