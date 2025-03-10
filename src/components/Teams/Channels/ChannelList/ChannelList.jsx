import { useEffect, useState } from 'react';
import Button from '../../../Button/Button';
import { CHANNEL, CREATE_CHANNEL } from '../../../../common/enums';
import CreateComp from '../../../CreateComp/CreateComp';

export default function ChannelList({ team, setViewChannel }) {
  const [channels, setChannels] = useState([]);
  const [viewCreateWindow, setViewCreateWindow] = useState(false);

  useEffect(() => {
    if (!team) return;

    setChannels(Object.values(team.channels));
  }, [team]);

  console.log(channels);
  return (
    <div className='flex flex-col bg-gray-800 p-4 overflow-y-auto'>
      <Button type={CREATE_CHANNEL} onClick={() => setViewCreateWindow(true)}>
        Create a Channel
      </Button>
      {viewCreateWindow && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
          <CreateComp setViewCreateWindow={setViewCreateWindow} type={CHANNEL} team={team} />
        </div>
      )}
      <ul className='flex flex-col'>
        {channels &&
          channels.length > 0 &&
          channels.map((channel) => (
            <li onClick={() => setViewChannel([true, channel])} key={channel.id}>
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
