import { useState } from 'react';
import Button from '../../../UI/Button/Button';
import ChannelInfo from '../ChannelInfo/ChannelInfo';
import { CHANNEL } from '../../../../common/enums';
import ChatWindow from '../../../Channels/ChatWindow/ChatWindow';
import PostWindow from '../../Posts/PostWIndow/PostWindow';

export default function Channel({ channel, setViewChannel, setCurrChannel }) {
  const [chatVisible, setChatVisible] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  // console.log(Object.values(channel.chat)[0].id);
  const handleHome = () => {
    setViewChannel(false);
    setCurrChannel(null);
  };

  return (
    <div className='flex flex-grow flex-col items-center'>
      <Button onClick={() => handleHome()}>Home</Button>
      <h1 className='text-4xl cursor-pointer hover:underline' onClick={() => setShowChannelInfo(true)}>
        {channel.title}
      </h1>
      <section className='flex flex-grow flex-col items-center'>
        {showChannelInfo ? (
          <ChannelInfo channel={channel} setShowChannelInfo={setShowChannelInfo} />
        ) : (
          <>
            <Button onClick={() => setChatVisible(!chatVisible)}>{chatVisible ? 'Posts' : 'Chats'}</Button>

            {chatVisible ? (
              <>
                <h1>Chat</h1>
                <ChatWindow selectedChat={channel} type={CHANNEL} />
              </>
            ) : (
              <>
                <h1>Posts</h1>
                <PostWindow channel={channel} />
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
