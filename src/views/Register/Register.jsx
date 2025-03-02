import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserHandle, getUserByUsername, getUserByEmail } from '../../services/user.service';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { nameCheck } from '../../utils/nameUtils';
import Modal from '../../components/Modal/Modal';

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

  /**
   * Registers a new user with the provided email and password.
   *
   * This function performs the following steps:
   * 1. Checks if the email and password are provided.
   * 2. Logs the registration attempt.
   * 3. Checks if a user with the provided email already exists.
   * 4. Validates the first and last names.
   * 5. Creates a new user with the provided email and password.
   * 6. Creates a user handle with the provided or derived username.
   * 7. Signs out the user and shows a success modal.
   *
   * @throws {Error} If the email or password is not provided.
   * @throws {Error} If a user with the provided email already exists.
   * @throws {Error} If the first or last names are invalid.
   */
  const register = () => {
    if (!user.email || !user.password || !user.username) {
      return alert('Please fill all empty sections.');
    }

    if (!nameCheck(user.firstName) || !nameCheck(user.lastName)) {
      throw new Error('First and last names must be between 4 and 32 characters and contain only letters');
    }

    console.log('Registering user: ', user.username);
    getUserByUsername(user.username)
      .then((userFromDB) => {
        if (userFromDB) {
          throw new Error(`User with username ${user.username} already exists`);
        }

        getUserByEmail(user.email).then((userFromDB) => {
          if (userFromDB) {
            throw new Error(`User with email ${user.email} already exists`);
          }
        });

        return createUserWithEmailAndPassword(auth, user.email, user.password);
      })
      .then((userCredential) => {
        return createUserHandle(user.username, user.firstName, user.lastName, userCredential.user.uid, user.email).then(() => {
          signOut(auth);
          setModalMessage('Registration successful! Please log in.');
          setShowModal(true);
        });
      })
      .catch((error) => {
        alert(error.message);
      });
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
      <div>
        <h3 className='text-2xl font-bold text-center mb-4'>Register</h3>
        <label className='text-gray-400' htmlFor='firstName'>
          First name:{' '}
        </label>
        <input className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.firstName} onChange={updateUser('firstName')} type='text' name='firstName' id='firstName' />
        <br />
        <br />
        <label className='text-gray-400' htmlFor='lastName'>
          Last name:{' '}
        </label>
        <input className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.lastName} onChange={updateUser('lastName')} type='text' name='lastName' id='lastName' />
        <br />
        <br />
        <label className='text-gray-400' htmlFor='username'>
          Username:{' '}
        </label>
        <input className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.username} onChange={updateUser('username')} type='text' name='username' id='username' />
        <br />
        <br />
        <label className='text-gray-400' htmlFor='email'>
          Email:{' '}
        </label>
        <input className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.email} onChange={updateUser('email')} type='email' name='email' id='email' />
        <br />
        <br />
        <label className='text-gray-400' htmlFor='password'>
          Password:{' '}
        </label>
        <input className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.password} onChange={updateUser('password')} type='password' name='password' id='password' />
        <br />
        <br />
        <button className='btn' onClick={register} id='btn-register-form'>
          Register
        </button>
        <p className='text-gray-400 text-center mt-6'>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className='text-blue-500 cursor-pointer hover:underline'>
            Login
          </button>
        </p>
      </div>
      <Modal show={showModal} handleClose={handleCloseModal} message={modalMessage} />
    </div>
  );
}
