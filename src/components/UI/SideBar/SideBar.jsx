import { ChatList } from '../../Channels/ChatList/ChatList';
import { useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { NavLink } from 'react-router-dom';
import { variant } from '../../../common/button-const';
import ViewStatus from '../../../views/ViewStatus/ViewStatus';
import React from 'react';
import PropTypes from 'prop-types';
import NotificationList from '../../Notifications/NotificationList/NotificationList';
import { getNotificationsCountForUser } from '../../../services/notification.service';
import { useEffect } from 'react';

export default function SideBar({ type, username, handleNewChat, chats, setChats, setSelectedChat }) {
  const { userData } = useContext(AppContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = getNotificationsCountForUser(userData.username, (receivedNotifications) => {
      setNotificationCount(receivedNotifications);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userData]);

  if (type === 'menu') {
    return (
      <div className='flex flex-col justify-between h-full bg-gray-700 p-2'>
        <div className='flex flex-col gap-4'>
          <div className={variant.home} onMouseEnter={() => setShowNotification(true)} onMouseLeave={() => setShowNotification(false)}>
            <div className='relative cursor-pointer py-2'>
              <img src='/images/notifications.png' className='h-10 w-10 flex justify-self-center' />
              {notificationCount > 0 && <span className='text-gray-300 absolute top-0 right-0 bottom-auto text-xs flex items-center justify-center rounded-full bg-gray-500 w-5 h-6'>{notificationCount}</span>}
            </div>
            {showNotification && <NotificationList />}
          </div>
          <NavLink className={({ isActive }) => `relative py-2 ${variant.home} ${isActive ? 'border-b-2 border-gray-500' : 'bg-gray-700'}`} to={'/teams'}>
            <img src='/images/teams.png' className='h-12 w-12 flex justify-self-center' />
          </NavLink>
          <NavLink className={({ isActive }) => `relative py-2 ${variant.home} ${isActive ? 'border-b-2 border-gray-500' : 'bg-gray-700'}`} to={'/chats'}>
            <img src='/images/updated-short-dark.png' className='h-14 w-14 flex justify-self-center' />
          </NavLink>
        </div>
        <div className='relative bottom-5 flex flex-col justify-between'>
          <div>
            <NavLink to={`/profile/${userData.username}`} className='mt-10'>
              <img src={userData.profilePicture || '/images/123.jpg'} className='h-13 w-13 flex justify-self-center rounded-full' />
            </NavLink>
          </div>
          <div className='absolute top-6 right-1'>
            <ViewStatus username={userData.username} />
          </div>
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
