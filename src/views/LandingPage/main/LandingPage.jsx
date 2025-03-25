import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../../store/app-context';
import LearnMore from '../LearnMore/LearnMore';
import { TEXT_BUTTON } from '../../../common/enums';
import Button from '../../../components/UI/Button/Button';
import { variant } from '../../../common/button-const';
import { getAllUsers } from '../../../services/user.service';
import { getAllTeams } from '../../../services/stats.services';

/**
 * LandingPage component renders the main landing page of the application.
 *
 * - If the user is not logged in (`userData` is falsy), it displays a welcome message,
 *   options to "Get Started" or "Learn more", and a section promoting community features.
 * - If the user is logged in (`userData` is truthy), it displays a personalized welcome message
 *   and a link to start chatting.
 *
 * @component
 * @returns {JSX.Element} The rendered LandingPage component.
 *
 */
export default function LandingPage() {
  const [learnMore, setLearnMore] = useState(false);
  const [numOfTeams, setNumOfTeams] = useState(null);
  const [numOfUsers, setNumOfUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = () => {
      getAllUsers(setNumOfUsers);
      getAllTeams(setNumOfTeams);
      setLoading(false);
    };

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  numOfTeams && numOfUsers && console.log(numOfTeams, numOfUsers);

  return (
    <div className='flex flex-col flex-grow'>
      {!userData && (
        <>
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
            <h1 className='text-4xl '>Looking for a community, group or team?</h1>
            <div className='grid grid-cols-2 grid-rows-2 gap-8 justify-items-center'>
              <p>Users</p>
              <p>Teams</p>
              <span>{numOfUsers.length}</span>
              <span>{numOfTeams}</span>
            </div>
            <Link className={variant.default} to={'/register'}>
              Join now!
            </Link>
          </section>
        </>
      )}
      {userData && (
        <>
          <section className='flex justify-between pl-16 w-full mt-30'>
            <h1 className='text-6xl font-bold'>Welcome, {userData.firstName}!</h1>
            <div className='flex flex-col items-center mt-40 mr-60'>
              <Link className={variant.getStarted} to={'chats'}>
                Start Chatting
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
