import { useContext, useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import { CHANNEL } from '../../../../common/enums';
import CreateComp from '../../../CreateComp/CreateComp';
import { AppContext } from '../../../../store/app-context';
import { variant } from '../../../../common/button-const';

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
    <div className='flex flex-col justify-between bg-gray-800 p-4 overflow-y-auto'>
      <div className='flex-grow'>
        <Button onClick={() => handleHome()}>Home</Button>
        <ul className='flex flex-col'>
          {channels &&
            channels.length > 0 &&
            channels.map((channel) => (
              <li className={variant.chatTeamListItem} onClick={() => changeChannel(channel)} key={channel.id}>
                {channel.title}
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

// team?.channels?.map((channel) => (
//     <li key={channel.id} onClick={() => setSelectedChannel(channel)}>
//     {channel.title}
//   </li>
// ))
