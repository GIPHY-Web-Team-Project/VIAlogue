import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../../store/app-context';
import SelectUsers from '../../SelectUsers/SelectUsers';
import { createTeam } from '../../../services/team.services';
import Modal from '../../Modal/Modal';
import { MAX_TEAM_TITLE_LENGTH, MIN_TEAM_TITLE_LENGTH } from '../../../common/constants';

export default function CreateTeam({ setViewCreateWindow }) {
  const { userData } = useContext(AppContext);
  const [selectedUsers, setSelectedUsers] = useState([userData]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    const teamMembers = [...selectedUsers];

    if (teamMembers.length < 2) {
      setModalMessage('Please select at least 2 users to create a team.');
      setShowModal(true);
      return;
    }

    if (!document.getElementById('title').value) {
      setModalMessage('Please enter a title for the team.');
      setShowModal(true);
      return;
    }

    const teamTitle = document.getElementById('title').value;

    if (teamTitle.trim().length < MIN_TEAM_TITLE_LENGTH || teamTitle.trim().length > MAX_TEAM_TITLE_LENGTH) {
      setModalMessage('Team titles can only be between 3 and 40 symbols long!');
      setShowModal(true);
      return;
    }

    try {
      await createTeam(teamTitle, userData.username, teamMembers, (teamId) => {
        // setSelectedTeam({ id: teamId, teamMembers });
        navigate(`/teams/${teamId}`);
      });
    } catch (error) {
      console.error(error.message);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg relative'>
      <h3>Create Team</h3>
      <label htmlFor='title'>Title: </label>
      <input type='text' name='title' id='title' />
      <br /> <br />
      <SelectUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      <br /> <br />
      <div className=''>
        <button
          className='btn'
          onClick={() => {
            handleCreateTeam();
          }}
        >
          Create Team
        </button>
        <button onClick={() => setViewCreateWindow(false)} className='btn'>
          Cancel
        </button>
      </div>
      <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />
    </div>
  );
}
