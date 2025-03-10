import { useState } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import TeamsList from '../../components/Teams/TeamsList/TeamsList';
import Button from '../../components/Button/Button';
import { CREATE_TEAM, TEAM } from '../../common/enums';
import CreateComp from '../../components/CreateComp/CreateComp';

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
            <CreateComp setViewCreateWindow={setViewCreateWindow} type={TEAM} />
          </div>
        )}
      </div>
    </div>
  );
}
