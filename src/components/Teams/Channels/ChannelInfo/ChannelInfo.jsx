import { useContext, useState } from 'react';
import Button from '../../../UI/Button/Button';
import { AppContext } from '../../../../store/app-context';
import { updateChannel } from '../../../../services/channel.services';
import { useParams } from 'react-router';
import AreYouSure from '../../../UI/AreYouSure/AreYouSure';

export default function ChannelInfo({ channel, setShowChannelInfo }) {
  const [showSure, setShowSure] = useState(false);
  const [sureMessage, setSureMessage] = useState('');
  const { userData } = useContext(AppContext);
  const { teamId } = useParams();

  const handleLeave = () => {
    setSureMessage('Are you sure you want to leave this channel?');
    setShowSure(true);
  };

  const leaveChannel = async () => {
    const updatedMembers = channel.members.filter((member) => member !== userData.username);
    console.log('updatedMembers', updatedMembers);
    await updateChannel(teamId, channel.id, { members: updatedMembers });
    console.log(channel);

    if (updatedMembers.length === 0) {
      await updatedMembers(teamId, channel.id, { isDeleted: true });
    }
  };

  return (
    <div>
      <h1>Channel Info</h1>
      <h3>{channel.title}</h3>
      <p>Owner: {channel.owner}</p>
      <p>Members: {channel.members.join(', ')}</p>
      <section>
        {/* {userData && userData.username === channel.owner && <Button onClick={() => {}}>Delete channel</Button>} */}
        <Button onClick={() => handleLeave()}>Leave channel</Button>

        <Button onClick={() => setShowChannelInfo(false)}>Close</Button>
      </section>
      {showSure && <AreYouSure message={sureMessage} setShowSure={setShowSure} fn={leaveChannel} />}
    </div>
  );
}
