import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../store/app-context';

export default function Header() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <header className='flex items-center justify-between py-2 px-4 bg-blue-900'>
        <span className='text-6xl'>LOGO</span>
        <div className='flex gap-4 mr-8'>
          <button onClick={() => navigate('/login')} className='border-4 border-dark-blue rounded-lg py-1 px-2 hover:text-black hover:bg-blue hover:border-blue cursor-pointer transition'>
            Log In
          </button>
          <button onClick={() => navigate('/register')} className='btn'>
            Sign Up
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className='flex items-center justify-between py-2 px-4 bg-blue-900'>
      <span className='text-4xl'>SMALL LOGO</span>
    </header>
  );
}
