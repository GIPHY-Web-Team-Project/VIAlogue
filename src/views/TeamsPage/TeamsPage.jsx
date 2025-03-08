import { useState } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import CreateTeam from '../../components/Teams/CreateTeam/CreateTeam';
import TeamsList from '../../components/Teams/TeamsList/TeamsList';
import Button from '../../components/Button/Button';
import { CREATE_TEAM } from '../../common/enums';

export default function TeamsPage() {
  const [viewCreateWindow, setViewCreateWindow] = useState(false);

  return (
    <div className='flex flex-grow'>
      <SideBar type='menu' />
      <div className='flex flex-grow justify-center'>
        <TeamsList />
        <Button type={CREATE_TEAM} onClick={() => setViewCreateWindow(true)}>
          Create a Team
        </Button>
        {viewCreateWindow && (
          <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
            <CreateTeam setViewCreateWindow={setViewCreateWindow} />
          </div>
        )}
      </div>
    </div>
  );
}
