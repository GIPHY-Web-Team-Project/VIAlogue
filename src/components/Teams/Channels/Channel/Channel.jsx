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
        <section className='bg-gray-800 grid grid-cols-4 grid-rows-1 p-5 content-center justify-items-center'>
          <h1 className='col-start-1 col-span-2 text-4xl cursor-pointer hover:underline' onClick={() => setShowChannelInfo(true)}>
            {channel.title}
          </h1>
          <Button onClick={() => navigate('/chats')}>Channel Chat</Button>
          <Button onClick={() => setViewCreatePost(true)}>Upload a Post</Button>
        </section>
        {viewCreatePost && <CreatePost channelId={channel.id} setViewCreatePost={setViewCreatePost} />}
        <section className='flex flex-col mt-20 overflow-y-auto px-20'>{showChannelInfo ? <ChannelInfo channel={channel} setShowChannelInfo={setShowChannelInfo} /> : <PostWindow channel={channel} />}</section>
      </div>
      <TeamParticipants users={users} />
    </div>
  );
}
