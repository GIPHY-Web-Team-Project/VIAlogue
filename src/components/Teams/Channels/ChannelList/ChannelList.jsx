import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import { CHANNEL } from '../../../../common/enums';
import CreateComp from '../../../CreateComp/CreateComp';
import { AppContext } from '../../../../store/app-context';
import { variant } from '../../../../common/button-const';
import PropTypes from 'prop-types';

export default function ChannelList({ team, setViewChannel, setCurrChannel }) {
  const [channels, setChannels] = useState([]);
  const [viewCreateWindow, setViewCreateWindow] = useState(false);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    if (!team || !userData) return;

    const currChannels = Object.values(team.channels);

    const existingChannels = currChannels.filter((channel) => !channel.isDeleted);

    const filteredChannels = existingChannels.filter((channel) => channel.members.includes(userData.username));

    setChannels(filteredChannels);
  }, [team, userData]);

  const changeChannel = (channel) => {
    setViewChannel(false);
    setCurrChannel(channel);
    setViewChannel(true);
  };

  const handleHome = () => {
    setViewChannel(false);
    setCurrChannel(null);
  };

  return (
    <div className='flex flex-col justify-between bg-gray-800 p-4 overflow-y-auto min-w-max'>
      <div>
        <Button onClick={() => handleHome()}>Home</Button>
        <ul className='flex flex-col items-center'>
          {channels &&
            channels.length > 0 &&
            channels.map((channel) => (
              <li className={`${variant.chatTeamListItem} text-xl mt-4 border-2 border-gray-700 px-2 py-1 rounded-md w-full max-w-full text-center`} onClick={() => changeChannel(channel)} key={channel.id}>
                {channel.title.length >= 9 ? `${channel.title.slice(0, 6)}...` : channel.title}
              </li>
            ))}
        </ul>
      </div>
      <Button onClick={() => setViewCreateWindow(true)}>Create a Channel</Button>
      {viewCreateWindow && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
          <CreateComp setViewCreateWindow={setViewCreateWindow} type={CHANNEL} team={team} />
        </div>
      )}
    </div>
  );
}

ChannelList.propTypes = {
  team: PropTypes.object.isRequired,
  setViewChannel: PropTypes.func.isRequired,
  setCurrChannel: PropTypes.func.isRequired,
};
