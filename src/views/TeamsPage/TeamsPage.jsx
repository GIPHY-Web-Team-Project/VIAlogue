import { useState } from 'react';
// import { AppContext } from '../../store/app-context';
// import { useNavigate } from 'react-router';
import SideBar from '../../components/SideBar/SideBar';
import CreateTeam from '../../components/Teams/CreateTeam/CreateTeam';
// import TeamsList from '../../components/Teams/TeamsList/TeamsList';
// import { updateTeam } from '../../services/team.services';
// import { ParticipantsTab } from '../../components/ParticipantsTab/ParticipantsTab';

export default function TeamsPage() {
  const [viewCreateWindow, setViewCreateWindow] = useState(false);
  // const [teams, setTeams] = useState(null);
  // const [selectedTeam, setSelectedTeam] = useState(null);
  // const { user, userData } = useContext(AppContext);
  // const [participants, setParticipants] = useState([]);
  // const [showParticipants, setShowParticipants] = useState(false);
  // const navigate = useNavigate();

  return (
    <div className='flex flex-grow'>
      <SideBar type='menu' />
      <div>
        {!viewCreateWindow ? (
          <button onClick={() => setViewCreateWindow(true)} className='btn'>
            Create a Team
          </button>
        ) : (
          <CreateTeam setViewCreateWindow={setViewCreateWindow} />
        )}
      </div>
    </div>
  );
}
