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
 * and updates the application state upon successful login. If the login fails, an error
 * message is displayed.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Login component.
 *
 * @example
 * <Login />
 *
 * @dependencies
 * - `useContext` from React: To access the application context (`AppContext`).
 * - `useState` from React: To manage the local state for user credentials.
 * - `useNavigate` from React Router: To navigate to different routes.
 * - `signInWithEmailAndPassword` from Firebase: To handle user authentication.
 *
 * @function login
 * Handles the login process. Validates user input, attempts to authenticate with Firebase,
 * updates the application state, and navigates to the `/chats` route upon success.
 *
 * @function updateUser
 * Updates the local state for user credentials dynamically based on the input field.
 *
 * @state {Object} user - The local state object containing `email` and `password`.
 * @state {string} user.email - The user's email address.
 * @state {string} user.password - The user's password.
 *
 * @context {Object} AppContext - The application context.
 * @context {Function} setAppState - Function to update the application state.
 *
 * @hooks
 * - `useContext(AppContext)`: To access the `setAppState` function.
 * - `useState`: To manage the `user` state.
 * - `useNavigate`: To navigate programmatically.
 *
 * @styles
 * - Tailwind CSS classes are used for styling the component.
 *
 * @errors
 * - Displays an alert if email or password is missing.
 * - Displays an alert with the error message if login fails.
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
    <div className='flex flex-grow items-center justify-center bg-gray-900 min-h-screen p-4'>
      <div className='bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h2 className='text-2xl font-bold text-center text-gray-100 mb-4'>Login</h2>
        <p className='text-gray-400 text-center mb-6'>Enter your credentials to log in</p>
        <div className='space-y-4'>
          <input
            type='email'
            placeholder='Email'
            value={user.email}
            onChange={updateUser('email')}
            className='w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100'
          />
          <input
            type='password'
            placeholder='Password'
            value={user.password}
            onChange={updateUser('password')}
            className='w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100'
          />
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

