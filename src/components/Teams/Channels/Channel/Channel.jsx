import ChatWindow from '../../../Channels/ChatWindow/ChatWindow';

export default function Channel({ channel }) {
  return (
    <div>
      <h1>{channel.title}</h1>
      <p>{channel.members}</p>
    </div>
  );
}
