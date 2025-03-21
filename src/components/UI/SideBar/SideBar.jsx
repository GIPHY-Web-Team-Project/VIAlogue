import { ChatList } from '../../Channels/ChatList/ChatList';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { NavLink } from 'react-router-dom';
import { variant } from '../../../common/button-const';
import ViewStatus from '../../../views/ViewStatus/ViewStatus';
import React from 'react';
import PropTypes from 'prop-types';

export default function SideBar({ type, username, handleNewChat, chats, setChats, setSelectedChat }) {
  const { userData } = useContext(AppContext);

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full bg-gray-700 p-2'>
        <div className='flex flex-col gap-4'>
          <NavLink className={({ isActive }) => 
            `${variant.home} ${isActive && "border-b-blue"} px-3 py-2 rounded-md`
          } to={'/teams'}>
            <img src="/images/teams.png" className="h-13 w-13 flex justify-self-center"/>
            <span className='flex justify-center'>Teams</span>
          </NavLink>
          <NavLink className={variant.home} to={'/chats'}>
            <img src="/images/updated-short-dark.png" className="h-15 w-15 flex justify-self-center"/>
            <span className='flex justify-center'>Chats</span>
          </NavLink>
        </div>
        <div className="relative">
        <img src={userData.profilePicture || '/images/123.jpg'} className="h-13 w-13 flex justify-self-center rounded-full"/>
        <div className="absolute bottom-5 right-2">
          <ViewStatus username={userData.username} />
        </div>
        <NavLink to={`/profile/${userData.username}`} className='mt-10'>
          <span className='flex justify-center mt-2'>Profile</span>
        </NavLink>
      </div>
      </div>
    );
  } else if (type === 'channels') {
    return <ChatList username={username} handleNewChat={handleNewChat} chats={chats} setChats={setChats} setSelectedChat={setSelectedChat} />;
  }
}

SideBar.propTypes = {
  type: PropTypes.string,
  username: PropTypes.string,
  handleNewChat: PropTypes.func,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  setSelectedChat: PropTypes.func,
};
