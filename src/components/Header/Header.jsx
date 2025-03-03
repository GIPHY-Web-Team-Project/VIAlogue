import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { AppContext } from '../../store/app-context';
import { auth } from '../../config/firebase-config';
import { signOut } from "firebase/auth";

export default function Header() {
  const navigate = useNavigate();
  const { userData, setAppState } = useContext(AppContext);

  const handleLogout = () => {
      signOut(auth)
        .then(() => {
          setAppState({
            user: null,
            userData: null
          });
          navigate('/login');
        })
        .catch((error) => {
          console.error(error.message);
        })
  }
  
  return (
    <header className='flex items-center justify-between py-2 px-4 bg-blue-900'>
      <span className='text-6xl'>LOGO</span>
      { !userData && (
      <div className='flex gap-4 mr-8'>
          <button onClick={() => navigate('/login')} className='border-4 border-dark-blue rounded-lg py-1 px-2 hover:bg-blue hover:border-blue cursor-pointer transition'>
          Log In
        </button>
        <button onClick={() => navigate('/register')} className='btn'>
          Sign Up
        </button>
      </div>
      )}
      { userData && (
      <div className='flex gap-4 mr-8'>
        <button onClick={handleLogout} className='btn'>
          Log Out
        </button>
      </div>
      )}
    </header>
  );
}
