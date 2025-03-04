import { useContext } from 'react';
import { AppContext } from '../../store/app-context';

export function ParticipantsTab({ participants, selectedObj, handleLeave }) {
  const { userData } = useContext(AppContext);

  return (
    <ul>
      {participants?.map((participant) => (
        <li key={participant.uid} className='participant'>
          <h5>{participant.username}</h5>
          {selectedObj && userData.username === participant.username && (
            <button className='btn' onClick={handleLeave} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
              Leave Chat
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
