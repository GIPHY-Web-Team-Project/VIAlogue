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
 * - Checks if the username or email already exists in the database.
 * - Registers the user using Firebase authentication and creates a user handle.
 * - Displays a modal on successful registration and navigates to the login page.
 *
 * @state {Object} user - The user object containing registration details.
 * @state {string} user.firstName - The user's first name.
 * @state {string} user.lastName - The user's last name.
 * @state {string} user.username - The user's username.
 * @state {string} user.email - The user's email address.
 * @state {string} user.password - The user's password.
 * @state {boolean} showModal - Controls the visibility of the modal.
 * @state {string} modalMessage - The message displayed in the modal.
 *
 * @dependencies
 * - `useState` - React hook for managing component state.
 * - `useNavigate` - React Router hook for navigation.
 * - `createUserWithEmailAndPassword` - Firebase function for user registration.
 * - `signOut` - Firebase function to sign out the user.
 * - `getUserByUsername` - Custom function to check if a username exists.
 * - `getUserByEmail` - Custom function to check if an email exists.
 * - `createUserHandle` - Custom function to create a user handle in the database.
 *
 * @modals
 * - Displays a modal with a success message upon successful registration.
 * - Navigates to the login page when the modal is closed.
 *
 * @validation
 * - Ensures all fields are filled.
 * - Validates first and last names to be between 4 and 32 characters and contain only letters.
 * - Validates username to be between 4 and 32 characters and contain only letters, numbers, underscores, dots, and hyphens.
 * - Checks if the username or email already exists in the database.
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
        return alert('Please fill all empty sections.');
      }

      if (!nameCheck(user.firstName) || !nameCheck(user.lastName)) {
        throw new Error('First and last names must be between 4 and 32 characters and contain only letters');
      }

      const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_.-]{4,32}$/;
        return usernameRegex.test(username);
      };

      if (!validateUsername(user.username)) {
        alert('Username must be between 4 and 32 characters and can only contain letters, numbers, underscores (_), dots (.), and hyphens (-).');
        return;
      }

      console.log('Registering user: ', user.username);
      const userFromDB = await getUserByUsername(user.username);
      if (userFromDB) {
        throw new Error(`User with username ${user.username} already exists`);
      }

      const emailExists = await getUserByEmail(user.email);
      if (emailExists) {
        throw new Error(`User with email ${user.email} already exists`);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await createUserHandle(user.username, user.firstName, user.lastName, userCredential.user.uid, user.email);
      await signOut(auth);
      setModalMessage('Registration successful! Please log in.');
      setShowModal(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const updateUser = (prop) => (e) => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <div className='flex flex-grow items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full'>
        <h3 className='text-3xl font-bold text-center text-gray-100 mb-6'>Register</h3>

        <label className='text-gray-400' htmlFor='firstName'>
          First name:
        </label>
        <input className='w-full p-3 mt-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.firstName} onChange={updateUser('firstName')} type='text' name='firstName' id='firstName' />

        <label className='text-gray-400' htmlFor='lastName'>
          Last name:
        </label>
        <input className='w-full p-3 mt-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.lastName} onChange={updateUser('lastName')} type='text' name='lastName' id='lastName' />

        <label className='text-gray-400' htmlFor='username'>
          Username:
        </label>
        <input className='w-full p-3 mt-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.username} onChange={updateUser('username')} type='text' name='username' id='username' />

        <label className='text-gray-400' htmlFor='email'>
          Email:
        </label>
        <input className='w-full p-3 mt-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.email} onChange={updateUser('email')} type='email' name='email' id='email' />

        <label className='text-gray-400' htmlFor='password'>
          Password:
        </label>
        <input className='w-full p-3 mt-2 mb-6 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.password} onChange={updateUser('password')} type='password' name='password' id='password' />

        <Button onClick={register} id='btn-register-form' className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition'>
          Register
        </Button>

        <p className='text-gray-400 text-center mt-6'>
          Already have an account?{' '}
          <Link className={variant.textButton} to={'/login'}>
            Login
          </Link>
        </p>
      </div>
      <Modal show={showModal} handleClose={handleCloseModal} message={modalMessage} />
    </div>
  );
}
