import { useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import ChannelInfo from '../ChannelInfo/ChannelInfo';
import PostWindow from '../../Posts/PostWIndow/PostWindow';
import { getUserByUsername } from '../../../../services/user.service';
import TeamParticipants from '../../TeamParticipants/TeamParticipants';
import { useNavigate } from 'react-router';

export default function Channel({ channel }) {
  const [users, setUsers] = useState([]);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!channel) return;

    const fetchUsers = async () => {
      const userList = await Promise.all(
        channel.members.map(async (username) => {
          return await getUserByUsername(username);
        })
      );
      setUsers(userList);
    };

    fetchUsers();
  }, [channel]);

  return (
    <div className='flex flex-grow flex-col'>
      <h1 className='text-4xl cursor-pointer hover:underline' onClick={() => setShowChannelInfo(true)}>
        {channel.title}
      </h1>
      <div className='flex'>
        <section className='flex flex-grow flex-col'>
          {showChannelInfo ? (
            <ChannelInfo channel={channel} setShowChannelInfo={setShowChannelInfo} />
          ) : (
            <>
              <Button onClick={() => navigate('/chats')}>Channel Chat</Button>
              <PostWindow channel={channel} />
            </>
          )}
        </section>
        <TeamParticipants users={users} />
      </div>
    </div>
  );
}
