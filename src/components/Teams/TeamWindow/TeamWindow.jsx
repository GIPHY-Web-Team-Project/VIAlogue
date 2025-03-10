import { useParams } from 'react-router';
import SideBar from '../../SideBar/SideBar';
import { useEffect, useState } from 'react';
import { getTeamById } from '../../../services/team.services';
import ChannelList from '../Channels/ChannelList/ChannelList';
import Loading from '../../Loading/Loading';

export default function TeamWindow() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);

    const unsubscribe = getTeamById(teamId, (team) => {
      setTeam(team);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [teamId]);

  return (
    <div className='flex flex-grow'>
      <SideBar type='menu' />
      <div className='flex flex-grow justify-between'>
        {loading ? (
          <Loading />
        ) : (
          <>
            <ChannelList team={team} />
            <div className=''>
              <h1>TEAM ID {teamId}</h1>
              <h3>{team?.title}</h3>
              <p>Owner: {team?.owner}</p>
            </div>
            <p>Members: {team?.members?.map((member) => member.username).join(', ')}</p>
          </>
        )}
      </div>
    </div>
  );
}
