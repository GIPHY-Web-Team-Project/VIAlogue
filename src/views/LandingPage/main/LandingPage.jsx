import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../../store/app-context';
import LearnMore from '../LearnMore/LearnMore';
import { TEXT_BUTTON } from '../../../common/enums';
import Button from '../../../components/UI/Button/Button';
import { variant } from '../../../common/button-const';
import { getAllUsers } from '../../../services/user.service';
import { getAllTeams } from '../../../services/stats.services';
import homePage from '../../../../public/images/home-page.png';
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
  const { userData, userLoading } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = () => {
      getAllUsers(setNumOfUsers);
      getAllTeams(setNumOfTeams);
    };

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
        setLoading(false);
      }
    };
  }, []);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen opacity-100 transition-opacity duration-500 ease-out">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue"></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col flex-grow items-center opacity-${userLoading ? 0 : 100} transition-opacity duration-500 ease-in delay-300'>
      {!userData && (
        <>
          {learnMore ? (
            <LearnMore setLearnMore={setLearnMore} />
          ) : (
            <section className='flex flex-col items-center bg-gray-700 rounded-xl mt-8 md:mt-auto w-full max-w-full md:max-w-[80vw] lg:max-w-[50vw] px-4 md:px-8 pt-4 md:pt-8 mb-8'>
              <div className='flex flex-col items-start justify-between w-full max-w-[50vw] mt-20 gap-8'>
                <h1 className='text-6xl font-bold'>Communication is key - start chatting now!</h1>
                <h4 className='text-2xl font-bold'>Conversations that fit your flow.
              Message friends, chat with your crew, or dive into team channels — however you connect, we’ve got the space for it.</h4>
              <Link className={variant.getStarted} to={'/register'}>
                  Get Started
                </Link>
                { /*<div className='flex flex-col items-center gap-4 w-full'>
                  <h4 className='text-xl font-bold text-center'>OR</h4>
                  <Button btnStyle={TEXT_BUTTON} onClick={() => setLearnMore(true)}>
                    Learn more
                  </Button>
                </div>
                */}
              </div>
              <div>
                <img src={homePage} className='mr-16 rounded-lg w-190 h-120' />
              </div>
            </section>
          )}

          <section className='flex flex-col items-center bg-gray-700 rounded-xl mt-auto w-full max-w-[20vw] px-8 pt-8'>
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500'></div>
              </div>
            ) : (
              <div className='grid grid-cols-2 grid-rows-2 gap-2 justify-items-center w-full'>
                <div className='w-15 h-15 bg-gray-500 rounded-full flex items-center justify-center text-white text-lg font-bold'>{numOfUsers && numOfUsers.length}</div>
                <div className='w-15 h-15 bg-gray-500 rounded-full flex items-center justify-center text-white text-lg font-bold'>{numOfTeams && numOfTeams}</div>
                <p className='text-xl border-gray-500'>Users</p>
                <p className='text-xl border-gray-500'>Teams</p>
              </div>
            )}
            {/* <Link className={variant.joinNow} to={'/register'}>
              Join now!
            </Link> */}
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
