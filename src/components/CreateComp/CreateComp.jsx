import { useContext, useState } from 'react';
import { AppContext } from '../../store/app-context';
import { useNavigate } from 'react-router';
import { MAX_TEAM_TITLE_LENGTH, MIN_TEAM_TITLE_LENGTH } from '../../common/constants';
import SelectUsers from '../SelectUsers/SelectUsersTeamChat/SelectUsersTeamChat';
import { CHANNEL, TEAM } from '../../common/enums';
import { createTeam } from '../../services/team.services';
import { createChannel } from '../../services/channel.services';
import TitleInput from '../TitleInput/TitleInput';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import SelectUsersTeamChat from '../SelectUsers/SelectUsersTeamChat/SelectUsersTeamChat';

export default function CreateComp({ setViewCreateWindow, type, teamIdForChannel }) {
  const { userData } = useContext(AppContext);
  const [selectedUsers, setSelectedUsers] = useState([userData]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const members = selectedUsers.map((user) => user.username);

    if (members.length < 2) {
      setModalMessage('Please select at least 2 users to create a team.');
      setShowModal(true);
      return;
    }

    if (!document.getElementById('title').value) {
      setModalMessage('Please enter a title for the team.');
      setShowModal(true);
      return;
    }

    const title = document.getElementById('title').value;

    if (title.trim().length < MIN_TEAM_TITLE_LENGTH || title.trim().length > MAX_TEAM_TITLE_LENGTH) {
      setModalMessage('Team titles can only be between 3 and 40 symbols long!');
      setShowModal(true);
      return;
    }

    try {
      if (type === TEAM) {
        await createTeam(title, userData.username, members, async (teamId) => {
          navigate(`/teams/${teamId}`);
        });
      } else if (type === CHANNEL) {
        await createChannel(title, teamIdForChannel, members, userData.username);
      }
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
      <h3 className='text-2xl'>Create chat</h3>
      <TitleInput />
      <br /> <br />
      <SelectUsersTeamChat selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      <br /> <br />
      <div className=''>
        <Button
          onClick={() => {
            handleCreate();
          }}
        >
          Create Team
        </Button>
        <Button onClick={() => setViewCreateWindow(false)}>Cancel</Button>
      </div>
      <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />
    </div>
  );
}
