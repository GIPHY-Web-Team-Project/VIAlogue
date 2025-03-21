import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import { CHANNEL } from '../../../../common/enums';
import CreateComp from '../../../CreateComp/CreateComp';
import { AppContext } from '../../../../store/app-context';
import { variant } from '../../../../common/button-const';
import PropTypes from 'prop-types';

export default function ChannelList({ team, setViewChannel }) {
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

  console.log(channels);
  return (
    <div className='flex flex-col bg-gray-800 p-4 overflow-y-auto'>
      <Button onClick={() => setViewCreateWindow(true)}>Create a Channel</Button>
      {viewCreateWindow && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
          <CreateComp setViewCreateWindow={setViewCreateWindow} type={CHANNEL} team={team} />
        </div>
      )}
      <ul className='flex flex-col'>
        {channels &&
          channels.length > 0 &&
          channels.map((channel) => (
            <li className={variant.chatTeamListItem} onClick={() => setViewChannel([true, channel])} key={channel.id}>
              {channel.title}
            </li>
          ))}
      </ul>
    </div>
  );
}

// team?.channels?.map((channel) => (
//     <li key={channel.id} onClick={() => setSelectedChannel(channel)}>
//     {channel.title}
//   </li>
// ))

ChannelList.propTypes = {
  team: PropTypes.object,
  setViewChannel: PropTypes.func,
};
