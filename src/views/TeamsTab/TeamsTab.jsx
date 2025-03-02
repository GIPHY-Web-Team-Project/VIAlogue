import { useContext } from 'react';
import { AppContext } from '../../store/app-context';

export default function TeamsTab() {
  const { user, userData } = useContext(AppContext);

  console.log(user, userData);

  return (
    <div>
      <h1>TeamsTab</h1>
    </div>
  );
}
