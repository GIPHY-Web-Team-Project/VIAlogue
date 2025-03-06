import { useContext, useEffect, useState } from 'react';
import { getTeamsByUserId } from '../../../services/team.services';
import { AppContext } from '../../../store/app-context';
import { useNavigate } from 'react-router';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = getTeamsByUserId(userData?.uid, (teams) => {
      setTeams(teams);
    });

    return () => {
      unsubscribe();
    };
  }, [userData]);

  return (
    <div>
      <h3>Teams</h3>
      <ul className='grid grid-cols-3 gap-4'>
        {teams.length !== 0 ? (
          <>
            {teams.map((team) => (
              <li onClick={() => navigate(`/teams/${team.id}`)} key={team.id} className='border p-4'>
                <h3>{team.title}</h3>
                <p>Owner: {team.owner}</p>
                <p>Members: {team.members.map((member) => member.username).join(', ')}</p>
              </li>
            ))}
          </>
        ) : (
          <h1>Create a team to see your teams here!</h1>
        )}
      </ul>
    </div>
  );
}
