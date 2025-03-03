import { useNavigate } from 'react-router';

export default function LearnMore({ setLearnMore }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
    setLearnMore(false);
  };

  return (
    <div className='flex flex-col z-10 bg-black ring-4 ring-blue-500 p-10 rounded-lg'>
      <h3 className='text-6xl font-bold'>VIALOGUE allows you to:</h3>
      <ul className='text-2xl list-disc'>
        <li>Create teams with your friends!</li>
        <li>Open chat channels in teams and chat with everyone!</li>
        <li>If outside of a team, you can chat with other users via chats!</li>
        <li>Chats and teams are both great but there is an alternative - you can add several people when creating a chat!</li>
      </ul>
      <button className='btn' onClick={handleClick}>
        Start chatting!
      </button>
    </div>
  );
}
