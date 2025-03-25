import React, { useContext, useState } from 'react';
import Button from '../../../UI/Button/Button';
import { AppContext } from '../../../../store/app-context';
import { removeChannel, updateChannel } from '../../../../services/channel.services';
import { useParams } from 'react-router';
import AreYouSure from '../../../UI/AreYouSure/AreYouSure';
import PropTypes from 'prop-types';
import { getTeamById } from '../../../../services/team.services';

export default function ChannelInfo({ channel, setShowChannelInfo, setCurrChannel }) {
  const [showSure, setShowSure] = useState(false);
  const [sureMessage, setSureMessage] = useState('');
  const [executeFn, setExecuteFn] = useState(false);
  const { userData } = useContext(AppContext);
  const { teamId } = useParams();

  const redirect = async () => {
    const team = await getTeamById(teamId);
    const general = Object.values(team.channels).filter((channel) => channel.title === 'general');

    setCurrChannel(general[0]);
  };

  const handleLeave = () => {
    setSureMessage('Are you sure you want to leave this channel?');
    setExecuteFn('leave');
    setShowSure(true);
  };

  const handleDelete = () => {
    setSureMessage('Are you sure you want to delete this channel?');
    setExecuteFn('delete');
    setShowSure(true);
  };

  const leaveChannel = async () => {
    const updatedMembers = channel.members.filter((member) => member !== userData.username);
    await updateChannel(teamId, channel.id, { members: updatedMembers });

    if (updatedMembers.length === 0) {
      await removeChannel(teamId, channel.id);
    }

    await redirect();
  };

  const deleteChannel = async () => {
    await removeChannel(teamId, channel.id);
    await redirect();
  };

  return (
    <div>
      <h1>Channel Info</h1>
      <h3>{channel.title}</h3>
      <p>Owner: {channel.owner}</p>
      <p>Members: {channel.members.join(', ')}</p>
      <section>
        {userData && userData.username === channel.owner && <Button onClick={() => handleDelete()}>Delete channel</Button>}
        <Button onClick={() => handleLeave()}>Leave channel</Button>

        <Button onClick={() => setShowChannelInfo(false)}>Close</Button>
      </section>
      {showSure && <AreYouSure message={sureMessage} setShowSure={setShowSure} executeFn={executeFn === 'leave' ? leaveChannel : deleteChannel} />}
    </div>
  );
}

ChannelInfo.propTypes = {
  channel: PropTypes.object,
  setShowChannelInfo: PropTypes.func,
  setCurrChannel: PropTypes.func.isRequired,
};
