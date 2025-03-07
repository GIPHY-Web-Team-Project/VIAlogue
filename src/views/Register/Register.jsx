import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserHandle, getUserByUsername, getUserByEmail } from '../../services/user.service';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { nameCheck } from '../../utils/nameUtils';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { TEXT_BUTTON } from '../../common/enums';

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

      console.log('Registering user: ', user.username);

      const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_.-]{4,32}$/;
        return usernameRegex.test(username);
      };
    
      if (!validateUsername(user.username)) {
        alert('Username must be between 4 and 32 characters and can only contain letters, numbers, underscores (_), dots (.), and hyphens (-).');
        return;
      }
      
      const userFromDBByUsername = await getUserByUsername(user.username);
      if (userFromDBByUsername) {
        throw new Error(`User with username ${user.username} already exists`);
      }

      const userFromDBByEmail = await getUserByEmail(user.email);
      if (userFromDBByEmail) {
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
        <Button onClick={register} id='btn-register-form'>
          Register
        </Button>
        <p className='text-gray-400 text-center mt-6'>
          Already have an account?{' '}
          <Button type={TEXT_BUTTON} onClick={() => navigate('/login')}>
            Login
          </Button>
        </p>
      </div>
      <Modal show={showModal} handleClose={handleCloseModal} message={modalMessage} />
    </div>
  );
}