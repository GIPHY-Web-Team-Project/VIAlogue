import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../../store/app-context';
import LearnMore from '../LearnMore/LearnMore';
import { TEXT_BUTTON } from '../../../common/enums';
import Button from '../../../components/UI/Button/Button';
import { variant } from '../../../common/button-const';

export default function LandingPage() {
  const [learnMore, setLearnMore] = useState(false);
  const { userData } = useContext(AppContext);

  // if (userData) {
  //   navigate('/teams');
  // }

  return (
    <div className='flex flex-col flex-grow'>
      {!userData && (
        <div className='flex flex-col flex-grow'>
          <section className='flex justify-between pl-16 w-full mt-30'>
            {learnMore && <LearnMore setLearnMore={setLearnMore} />}
            {!learnMore && (
              <>
                <h1 className='text-6xl font-bold'>Communication is key - start chatting now!</h1>
                <div className='flex flex-col items-center mt-40 mr-60'>
                  <Link className={variant.getStarted} to={'/register'}>
                    Get Started
                  </Link>
                  <Button btnStyle={TEXT_BUTTON} onClick={() => setLearnMore(true)}>
                    Learn more
                  </Button>
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
            <Link className={variant.default} to={'/register'}>
              Join now!
            </Link>
          </section>
        </div>
      )}
      {userData && (
        <div className='flex flex-col flex-grow'>
          <section className='flex justify-between pl-16 w-full mt-30'>
            <h1 className='text-6xl font-bold'>Welcome, {userData.firstName}!</h1>
            <div className='flex flex-col items-center mt-40 mr-60'>
              <Link className={variant.getStarted} to={'chats'}>
                Start Chatting
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
