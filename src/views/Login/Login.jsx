import { AppContext } from '../../store/app-context';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import Button from '../../components/UI/Button/Button';
import { CANCEL } from '../../common/enums';
import { variant } from '../../common/button-const';


export default function Login() {
  const { setAppState } = useContext(AppContext);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const login = () => {
    if (!user.email || !user.password) {
      return alert('Please enter both email and password');
    }

    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        const loggedInUser = userCredential.user;

        setAppState({
          user: loggedInUser,
          userData: null,
        });

        navigate('/chats');
      })
      .catch((error) => {
        console.error('Login failed', error);
        alert('Login failed: ' + error.message);
      });
  };

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  return (
    <div className='flex flex-grow items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h2 className='text-2xl font-bold text-center mb-4'>Login</h2>
        <p className='text-gray-400 text-center mb-6'>Enter your credentials to log in</p>
        <div className='space-y-4'>
          <input type='email' placeholder='Email' value={user.email} onChange={updateUser('email')} className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <input type='password' placeholder='Password' value={user.password} onChange={updateUser('password')} className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' />
        </div>
        <div className='flex justify-end space-x-4 mt-6'>
          <Button btnStyle={CANCEL} onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button onClick={login}>Login</Button>
        </div>
        <p className='text-gray-400 text-center mt-6'>
          Don't have an account?{' '}
          <Link className={variant.textButton} to={'/register'}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

