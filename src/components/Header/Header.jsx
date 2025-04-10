import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../store/app-context';
import { LOGIN } from '../../common/enums';
import Button from '../UI/Button/Button';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  if (!user) {
    return (
      <header className='flex items-center justify-between py-2 px-4 bg-blue-950'>
        <span className='text-6xl'>
          <img src='../../../../public/images/updated-long-dark.png' className='h-15 w-45' />
        </span>
        <div className='flex gap-4 mr-8'>
          <Button btnStyle={LOGIN} onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button onClick={() => navigate('/register')}>Sign Up</Button>
        </div>
      </header>
    );
  }

  return (
    <header className='flex items-center justify-between py-2 px-4 bg-blue-950'>
      <span className='text-4xl'>
        <img src='../../../../public/images/updated-short-dark.png' className='h-15 w-15' />
      </span>
    </header>
  );
}
