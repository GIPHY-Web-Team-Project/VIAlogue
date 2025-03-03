import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../../store/app-context';
import LearnMore from '../LearnMore/LearnMore';

export default function LandingPage() {
  const navigate = useNavigate();
  const [learnMore, setLearnMore] = useState(false);
  const { user } = useContext(AppContext);

  if (user) {
    navigate('/teams');
  }

  return (
    <div className='flex flex-col flex-grow'>
      <section className='flex justify-between pl-16 w-full mt-30'>
        {learnMore && <LearnMore setLearnMore={setLearnMore} />}
        {!learnMore && (
          <>
            <h1 className='text-6xl font-bold'>Communication is key - start chatting now!</h1>
            <div className='flex flex-col items-center mt-40 mr-60'>
              <button className='m-1 text-2xl p-6 bg-dark-blue rounded-lg hover:bg-blue hover:text-black hover:cursor-pointer transition'>Get Started</button>
              <button onClick={() => setLearnMore(true)} className='text-blue-500 cursor-pointer hover:underline'>
                Learn more
              </button>
            </div>
          </>
        )}
      </section>

      <section className='flex flex-col items-center gap-5 border mx-auto mt-auto w-content p-4'>
        <h1>Looking for a community, group or team?</h1>
        <div className='grid grid-cols-2 grid-rows-2 gap-4 justify-items-center'>
          <p>Users</p>
          <p>Teams</p>
          <span>numOfUsers</span>
          <span>numOfTeams</span>
        </div>
        <button onClick={() => navigate('/register')} className='p-10 btn'>
          Join now!
        </button>
      </section>
    </div>
  );
}
