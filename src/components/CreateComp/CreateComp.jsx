import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/app-context';
import { useNavigate } from 'react-router';
import { MAX_TEAM_TITLE_LENGTH, MIN_TEAM_TITLE_LENGTH } from '../../common/constants';
import { CHANNEL, TEAM } from '../../common/enums';
import { createTeam } from '../../services/team.services';
import { createChannel } from '../../services/channel.services';
import TitleInput from '../UI/TitleInput/TitleInput';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import SelectUsersTeamChat from '../SelectUsers/SelectUsersTeamChat/SelectUsersTeamChat';
import SelectUsersChannel from '../SelectUsers/SelectUsersChannel/SelectUsersChannel';
import { useUsers } from '../../hooks/useUsers';
import PropTypes from 'prop-types';
import { addNotification } from '../../services/notification.service';

export default function CreateComp({ setViewCreateWindow, type, team }) {
  const { userData } = useContext(AppContext);
  const [selectedUsers, setSelectedUsers] = useState([userData?.username]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState(null);
  const navigate = useNavigate();
  const { users } = useUsers(userData);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (users) {
      const availableUsers = users
        .filter((user) => user.username !== userData.username)
        .filter((user) => !selectedUsers.includes(user.username));
      setUserList(availableUsers);
    }
  }, [users, selectedUsers]);

  useEffect(() => {
    if (type !== CHANNEL) return;
    setMembers(Object.values(team.members));
  }, [team]);

  const handleCreate = async () => {
    const members = selectedUsers.map((user) => user);

    if (members.length < 2) {
      setModalMessage('Please select at least 2 users.');
      setShowModal(true);
      return;
    }

    if (!document.getElementById('title').value) {
      setModalMessage('Please enter a title.');
      setShowModal(true);
      return;
    }

    const title = document.getElementById('title').value;

    if (title.trim().length < MIN_TEAM_TITLE_LENGTH || title.trim().length > MAX_TEAM_TITLE_LENGTH) {
      setModalMessage('Title can only be between 3 and 40 symbols long!');
      setShowModal(true);
      return;
    }

    try {
      if (type === TEAM) {
        members.forEach(async (member) => {
          if (member !== userData.username) { 
            await addNotification(member, 'Team', `You have been invited to join ${title} by ${userData.username}`);
          }
        });
        await createTeam(title, userData.username, members, async (teamId) => {
          navigate(`/teams/${teamId}`);
        });
      } else if (type === CHANNEL) {
        await createChannel(title, team.id, members, userData.username);
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
      <h3 className='text-2xl'>Create {type}</h3>
      <TitleInput />
      <br /> <br />
      {type === CHANNEL && members && <SelectUsersChannel selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} teamMembers={members} type={type} />}
      {type === TEAM && <SelectUsersTeamChat selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} userList={userList} setUserList={setUserList}/>}
      <br /> <br />
      <div className=''>
        <Button
          onClick={() => {
            handleCreate();
          }}
        >
          Create {type}
        </Button>
        <Button onClick={() => setViewCreateWindow(false)}>Cancel</Button>
      </div>
      <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal} />
    </div>
  );
}

CreateComp.propTypes = {
  setViewCreateWindow: PropTypes.func,
  type: PropTypes.string,
  team: PropTypes.object,
};
