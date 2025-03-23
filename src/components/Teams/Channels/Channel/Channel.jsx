import { useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import ChannelInfo from '../ChannelInfo/ChannelInfo';
import PostWindow from '../../Posts/PostWIndow/PostWindow';
import { getUserByUsername } from '../../../../services/user.service';
import TeamParticipants from '../../TeamParticipants/TeamParticipants';
import { useNavigate } from 'react-router';
import CreatePost from '../../Posts/CreatePost/CreatePost';

export default function Channel({ channel }) {
  const [users, setUsers] = useState([]);
  const [viewCreatePost, setViewCreatePost] = useState(false);
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
    <div className='flex flex-grow'>
      <div className='flex flex-grow flex-col max-h-screen'>
        <section className='flex justify-between px-20'>
          <h1 className='text-4xl cursor-pointer hover:underline' onClick={() => setShowChannelInfo(true)}>
            {channel.title}
          </h1>
          <Button onClick={() => navigate('/chats')}>Channel Chat</Button>
          <Button onClick={() => setViewCreatePost(true)}>Upload a Post</Button>
        </section>
        {viewCreatePost && <CreatePost channelId={channel.id} setViewCreatePost={setViewCreatePost} />}
        <section className='flex flex-col flex-grow mt-20 overflow-y-auto '>{showChannelInfo ? <ChannelInfo channel={channel} setShowChannelInfo={setShowChannelInfo} /> : <PostWindow channel={channel} />}</section>
      </div>
      <TeamParticipants users={users} />
    </div>
  );
}
