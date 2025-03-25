import { AppContext } from '../../store/app-context';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import Button from '../../components/UI/Button/Button';
import { CANCEL } from '../../common/enums';
import { variant } from '../../common/button-const';

/**
 * Login component for user authentication.
 *
 * This component provides a login form where users can enter their email and password
 * to authenticate. It uses Firebase's `signInWithEmailAndPassword` for authentication
 * and updates the application state upon successful login.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Login component.
 *
 * @example
 * // Usage in a React application
 * import Login from './Login';
 *
 * function App() {
 *   return <Login />;
 * }
 *
 * @function
 * @name Login
 *
 * @description
 * - Displays a login form with email and password fields.
 * - Validates user input to ensure both fields are filled.
 * - Authenticates the user using Firebase and updates the app state.
 * - Redirects the user to the `/chats` page upon successful login.
 * - Provides a link to the registration page for new users.
 *
 * @dependencies
 * - `useContext` from React for accessing the application context.
 * - `useState` from React for managing form state.
 * - `useNavigate` from React Router for navigation.
 * - `signInWithEmailAndPassword` from Firebase for authentication.
 *
 * @hooks
 * - `useContext(AppContext)` - Accesses the application state context.
 * - `useState` - Manages the state of the email and password fields.
 * - `useNavigate` - Handles navigation after login.
 *
 * @events
 * - `onClick` - Triggers the login function when the "Login" button is clicked.
 * - `onChange` - Updates the email and password state when the input fields change.
 */
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
          Don&apos;t have an account?{' '}
          <Link className={variant.textButton} to={'/register'}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
