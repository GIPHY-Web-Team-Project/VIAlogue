import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserHandle, getUserByUsername, getUserByEmail } from '../../services/user.service';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { nameCheck } from '../../utils/nameUtils';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import { variant } from '../../common/button-const';

/**
 * Register component for user registration.
 *
 * This component provides a registration form for users to create an account.
 * It includes fields for first name, last name, username, email, and password.
 * The form validates user input and interacts with backend services to register the user.
 *
 * @component
 * @returns {JSX.Element} The rendered Register component.
 *
 * @example
 * <Register />
 *
 * @function
 * @name Register
 *
 * @description
 * - Validates user input for first name, last name, username, email, and password.
 * - Checks if the username and email already exist in the database.
 * - Registers the user using Firebase authentication and creates a user handle.
 * - Displays a modal on successful registration and navigates to the login page.
 *
 * @state {Object} user - The user object containing registration details.
 * @state {string} user.firstName - The user's first name.
 * @state {string} user.lastName - The user's last name.
 * @state {string} user.username - The user's username.
 * @state {string} user.email - The user's email address.
 * @state {string} user.password - The user's password.
 * @state {boolean} showModal - State to control the visibility of the modal.
 * @state {string} modalMessage - Message to display in the modal.
 *
 * @dependencies
 * - `useState` from React for managing component state.
 * - `useNavigate` from React Router for navigation.
 * - `createUserWithEmailAndPassword`, `signOut` from Firebase for authentication.
 * - `getUserByUsername`, `getUserByEmail`, `createUserHandle` for backend interactions.
 * - `Button`, `Modal` components for UI elements.
 *
 * @throws {Error} Throws an error if validation fails or if the username/email already exists.
 */
export default function Register() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      if (!user.email || !user.password || !user.username) {
        setModalMessage(`Please fill all empty sections.`);
        setShowModal(true);
        return;
      }

      if (!nameCheck(user.firstName) || !nameCheck(user.lastName)) {
        setModalMessage(`First and last names must be between 4 and 32 characters and contain only letters.`);
        setShowModal(true);
        return;
      }

      const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_.-]{5,35}$/;
        return usernameRegex.test(username);
      };

      if (!validateUsername(user.username)) {
        setModalMessage(`Username must be between 5 and 35 characters and can only contain letters, numbers, underscores (_), dots (.), and hyphens (-).`);
        setShowModal(true);
        return;
      }

      console.log('Registering user: ', user.username);
      const userFromDB = await getUserByUsername(user.username);
      if (userFromDB) {
        setModalMessage(`User with username ${user.username} already exists`);
        setShowModal(true);
        return;
      }

      const emailExists = await getUserByEmail(user.email);
      if (emailExists) {
        setModalMessage(`User with email ${user.email} already exists`);
        setShowModal(true);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await createUserHandle(user.username, user.firstName, user.lastName, userCredential.user.uid, user.email);
      await signOut(auth);
      setModalMessage('Registration successful! Please log in.');
      setShowModal(true);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      setModalMessage('Registration was not successful! Please try again.');
      setShowModal(true);
    }
  };

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  return (
    <div className='flex flex-grow items-center justify-center bg-gray-900 max-h-screen p-4'>
      <div className='bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h3 className='text-2xl md:text-3xl font-bold text-center text-gray-100 mb-6'>Register</h3>

        <div className='space-y-4 mb-6'>
          <div>
            <label className='text-gray-400' htmlFor='firstName'>
              First name:
            </label>
            <input className='w-full p-3 mt-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.firstName} onChange={updateUser('firstName')} type='text' name='firstName' id='firstName' />
          </div>

          <div>
            <label className='text-gray-400' htmlFor='lastName'>
              Last name:
            </label>
            <input className='w-full p-3 mt-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.lastName} onChange={updateUser('lastName')} type='text' name='lastName' id='lastName' />
          </div>

          <div>
            <label className='text-gray-400' htmlFor='username'>
              Username:
            </label>
            <input className='w-full p-3 mt-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.username} onChange={updateUser('username')} type='text' name='username' id='username' />
          </div>

          <div>
            <label className='text-gray-400' htmlFor='email'>
              Email:
            </label>
            <input className='w-full p-3 mt-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.email} onChange={updateUser('email')} type='email' name='email' id='email' />
          </div>

          <div>
            <label className='text-gray-400' htmlFor='password'>
              Password:
            </label>
            <input className='w-full p-3 mt-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.password} onChange={updateUser('password')} type='password' name='password' id='password' />
          </div>
        </div>

        <Button onClick={register} id='btn-register-form'>
          Register
        </Button>

        <p className='text-gray-400 text-center mt-6'>
          Already have an account?{' '}
          <Link className={variant.textButton} to={'/login'}>
            Login
          </Link>
        </p>
      </div>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
}
