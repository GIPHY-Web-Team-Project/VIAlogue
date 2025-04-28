import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../store/app-context';
import { LOGIN, SIGNUP } from '../../common/enums';
import Button from '../UI/Button/Button';
import updatedLongDark from '../../../public/images/updated-long-dark.png';
import updatedShortDark from '../../../public/images/updated-short-dark.png';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  if (!user) {
    return (
      <header className='flex items-center justify-between py-2 px-4 bg-gray-700'>
        <span className='text-6xl cursor-pointer' onClick={() => navigate('/')}>
          <img src={updatedLongDark} className='h-17 w-45' />
        </span>
        <div className='flex gap-4 mr-4'>
          <Button btnStyle={SIGNUP} onClick={() => navigate('/register')}>Sign Up</Button>
          <Button btnStyle={LOGIN} onClick={() => navigate('/login')}>
            Log In
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className='flex items-center justify-between py-2 px-4 bg-blue-950'>
      <span className='text-4xl  cursor-pointer'>
        <img src={updatedShortDark} className='h-15 w-15' />
      </span>
    </header>
  );
}
