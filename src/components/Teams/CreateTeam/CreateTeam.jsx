import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../../store/app-context';
import SelectUsers from '../../SelectUsers/SelectUsers';
import { createTeam } from '../../../services/team.services';
import Modal from '../../Modal/Modal';

export default function CreateTeam({ setViewCreateWindow }) {
  const { userData } = useContext(AppContext);
  const [selectedUsers, setSelectedUsers] = useState([userData]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    const teamMembers = selectedUsers.map((user) => user.username);

    if (teamMembers.length < 2) {
      setModalMessage('Please select at least 2 users to create a chat');
      setShowModal(true);
      return;
    }

    const teamTitle = document.getElementById('title').value.toLowerCase();

    try {
      await createTeam(teamTitle, userData.username, teamMembers, (teamId) => {
        // setSelectedTeam({ id: teamId, teamMembers });
        navigate(`/teams/${teamId}`);
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
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
            navigate(`/`);
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
