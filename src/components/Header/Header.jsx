import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../store/app-context';
import { auth } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import { LOGIN } from '../../common/enums';
import Button from '../Button/Button';

export default function Header() {
  const navigate = useNavigate();
  const { user, setAppState } = useContext(AppContext);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setAppState({
          user: null,
          userData: null,
        });
        navigate('/login');
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  if (!user) {
    return (
      <header className='flex items-center justify-between py-2 px-4 bg-blue-950'>
        <span className='text-6xl'><img src="/images/updated-long-dark.png" className="h-15 w-45"/></span>
        <div className='flex gap-4 mr-8'>
          <Button type={LOGIN} onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button onClick={() => navigate('/register')}>Sign Up</Button>
        </div>
      </header>
    );
  }

  return (
    <header className='flex items-center justify-between py-2 px-4 bg-blue-950'>
      <span className='text-4xl'><img src="/images/updated-short-dark.png" className="h-15 w-15"/></span>
    </header>
  );
}
