import { useContext, useEffect, useState } from 'react';
import { getTeamsByUserId } from '../../../services/team.services';
import { AppContext } from '../../../store/app-context';
import Team from '../Team/Team';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = getTeamsByUserId(userData?.uid, (teams) => {
      setTeams(teams);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userData]);

  return (
    <div className=''>
      <ul className='grid grid-cols-3 gap-32 my-10'>
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
    </div>
  );
}
