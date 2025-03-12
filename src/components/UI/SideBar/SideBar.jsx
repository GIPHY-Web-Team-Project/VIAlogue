import { Link } from 'react-router';
import { ChatList } from '../../Channels/ChatList/ChatList';
import { variant } from '../../../common/button-const';

export default function SideBar({ type, username, handleNewChat, chats, setChats, setSelectedChat }) {
  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full bg-gray-700 p-2'>
        <div className='flex flex-col gap-4'>
          <Link className={variant.default} to={'/teams'}>
            <img src="/images/teams.png" className="h-13 w-13 flex justify-self-center"/>
          </Link>
          <Link className={variant.default} to={'/chats'}>
            <img src="/images/updated-short-dark.png" className="h-15 w-15 flex justify-self-center"/>
          </Link>
        </div>
        <Link className={variant.default} to={'/profile'}>
          Profile
        </Link>
      </div>
    );
  } else if (type === 'channels') {
    return <ChatList username={username} handleNewChat={handleNewChat} chats={chats} setChats={setChats} setSelectedChat={setSelectedChat} />;
  }
}
