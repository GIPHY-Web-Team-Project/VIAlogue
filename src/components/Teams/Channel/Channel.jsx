import { useState } from 'react';
import Button from '../../UI/Button/Button';
import ChannelInfo from '../Channels/ChannelInfo/ChannelInfo';

export default function Channel({ channel, setViewChannel }) {
  const [chatVisible, setChatVisible] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  return (
    <div className='flex flex-grow flex-col items-center'>
      <Button onClick={() => setViewChannel([false, null])}>Home</Button>
      <h1 className='text-4xl cursor-pointer hover:underline' onClick={() => setShowChannelInfo(true)}>
        {channel.title}
      </h1>
      <section>
        {showChannelInfo ? (
          <ChannelInfo channel={channel} setShowChannelInfo={setShowChannelInfo} />
        ) : (
          <>
            <Button onClick={() => setChatVisible(!chatVisible)}>{chatVisible ? 'Posts' : 'Chats'}</Button>

            {chatVisible ? <h1>Chat</h1> : <h1>Posts</h1>}
            {/* <ChatWindow channel={channel} /> */}
          </>
        )}
      </section>
      {/* <Modal show={showModal} handleClose={() => setShowModal(false)} message={message} /> */}
    </div>
  );
}
