import { useState } from 'react';
import Button from '../../../Button/Button';
import ChatWindow from '../../../Channels/ChatWindow/ChatWindow';
import Modal from '../../../Modal/Modal';

export default function Channel({ channel }) {
  const [chatVisible, setChatVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleTitleClick = () => {
    setMessage(`${channel.title}\nOwner: ${channel.owner}\nMembers: ${channel.members.map((member) => member).join(', ')}`);
    setShowModal(true);
  };

  return (
    <div className='flex flex-grow flex-col items-center'>
      <h1 className='text-4xl cursor-pointer hover:underline' onClick={() => handleTitleClick()}>
        {channel.title}
      </h1>
      <section>
        <Button onClick={() => setChatVisible(!chatVisible)}>{chatVisible ? 'Posts' : 'Chats'}</Button>
        {chatVisible ? <h1>Chat</h1> : <h1>Posts</h1>}
        {/* <ChatWindow channel={channel} /> */}
      </section>
      <Modal show={showModal} handleClose={() => setShowModal(false)} message={message} />
    </div>
  );
}
