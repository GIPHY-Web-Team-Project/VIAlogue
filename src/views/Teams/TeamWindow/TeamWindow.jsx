import { useParams } from 'react-router';
import SideBar from '../../../components/UI/SideBar/SideBar';
import { useEffect, useState } from 'react';
import { getTeamById } from '../../../services/team.services';
import ChannelList from '../../../components/Teams/Channels/ChannelList/ChannelList';
import Loading from '../../../components/UI/Loading/Loading';
import Channel from '../../../components/Teams/Channels/Channel/Channel';

export default function TeamWindow() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewChannel, setViewChannel] = useState(false);
  const [currChannel, setCurrChannel] = useState(null);
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
            <ChannelList team={team} setViewChannel={setViewChannel} setCurrChannel={setCurrChannel} />
            {viewChannel === true ? (
              <Channel channel={currChannel} setViewChannel={setViewChannel} setCurrChannel={setCurrChannel} />
            ) : (
              <>
                <div className=''>
                  <h1>TEAM ID {teamId}</h1>
                  <h3>{team?.title}</h3>
                  <p>Owner: {team?.owner}</p>
                </div>
              </>
            )}
            {team && !viewChannel && (
              <div>
                <h3>Team Members:</h3>
                <p>{team.members.map((member) => member).join(', ')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
