import { useContext, useEffect, useState } from 'react';
import { getTeamsByUsername } from '../../../services/team.services';
import { AppContext } from '../../../store/app-context';
import Team from '../Team/Team';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = getTeamsByUsername(userData?.username, (teams) => {
      setTeams(teams);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userData]);

  return (
    <ul className='grid grid-cols-3 gap-32 my-10 overflow-y-auto px-70 pt-2'>
      {teams.length !== 0 ? (
        <>
          {teams.map((team) => (
            <Team key={team.id} team={team} />
          ))}
        </>
      ) : (
        <h1>Create a team to see your teams here!</h1>
      )}
    </ul>
  );
}
