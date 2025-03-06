import { useParams } from 'react-router';
import SideBar from '../../SideBar/SideBar';
import { useEffect, useState } from 'react';
import { getTeamById } from '../../../services/team.services';

export default function TeamWindow() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    if (!teamId) return;

    const unsubscribe = getTeamById(teamId, (team) => {
      setTeam(team);
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
      <div>
        {/* sidebar za channels? */}
        <h1>TEAM ID {teamId}</h1>
        <div>
          <h3>{team?.title}</h3>
          <p>Owner: {team?.owner}</p>
          <p>Members: {team?.members?.map((member) => member.username).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
