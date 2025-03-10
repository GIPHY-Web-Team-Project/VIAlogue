import { useEffect, useState } from 'react';
import Button from '../../../Button/Button';
import { CHANNEL, CREATE_CHANNEL } from '../../../../common/enums';
import CreateComp from '../../../CreateComp/CreateComp';

export default function ChannelList({ team, setSelectedChannel }) {
  const [channels, setChannels] = useState([]);
  const [viewCreateWindow, setViewCreateWindow] = useState(false);

  //   console.log(channels, typeof channels);

  useEffect(() => {
    if (!team) return;

    console.log(team);
    setChannels(Object.keys(team.channels));
  }, [team]);

  return (
    <div className='flex flex-col bg-gray-800 p-4 overflow-y-auto'>
      <Button type={CREATE_CHANNEL} onClick={() => setViewCreateWindow(true)}>
        Create a Team
      </Button>
      {viewCreateWindow && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
          <CreateComp setViewCreateWindow={setViewCreateWindow} type={CHANNEL} teamIdForChannel={team.id} />
        </div>
      )}
      <ul className='flex flex-col'>{channels}</ul>
    </div>
  );
}

// team?.channels?.map((channel) => (
//     <li key={channel.id} onClick={() => setSelectedChannel(channel)}>
//     {channel.title}
//   </li>
// ))
