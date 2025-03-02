import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { getUserData } from '../../services/user.service';
// import defaultProfilePicture from '../../assets/default-profile-picture.jpg';
import { AppContext } from '../../store/app-context';
import { auth, db } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const { user, userData, setAppState } = useContext(AppContext);
  const fileInputRef = useRef(null);
  // const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [isEditingField, setIsEditingField] = useState({
    firstName: false,
    lastName: false,
  });

  useEffect(() => {
    if (userData) {
      // setProfilePicture(userData.photoURL || defaultProfilePicture);
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
    }
  }, [userData]);

  // const handleProfilePictureChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     try {
  //       const newPictureUrl = await uploadProfilePicture(file, user?.uid, userData.username);
  //       setProfilePicture(newPictureUrl);
  //     } catch (error) {
  //       console.error('Error uploading profile picture:', error);
  //     }
  //   }
  // };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSaveField = async (field) => {
    try {
      const updatedData = {
        [field]: field === 'firstName' ? firstName : field === 'lastName' && lastName,
      };

      const userRef = ref(db, `users/${userData.username}`);
      await update(userRef, updatedData);

      const updatedUserData = await getUserData(user.uid);
      setAppState((prev) => ({ ...prev, userData: updatedUserData }));

      setIsEditingField((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error('Error updating profile field:', error);
    }
  };

  return (
    <div className='flex flex-grow items-center justify-center bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6'>User Profile</h2>
        <div className='flex flex-col items-center'>
          <img alt='Profile' className='w-24 h-24 rounded-full cursor-pointer' onClick={() => fileInputRef.current.click()} />
          <input type='file' ref={fileInputRef} className='hidden' />
        </div>
        <div className='mt-6 space-y-4'>
          <div>
            <label className='text-gray-400'>Username:</label>
            <div className='bg-gray-700 p-2 rounded'>{userData?.username}</div>
          </div>
          <div>
            <label className='text-gray-400'>Email:</label>
            <div className='bg-gray-700 p-2 rounded '>{userData?.email}</div>
          </div>
          <div>
            <label className='text-gray-400'>First Name:</label>
            {isEditingField.firstName ? (
              <div className='flex space-x-2'>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className='w-full p-2 bg-gray-700  rounded focus:outline-none focus:ring-2 focus:ring-blue-500' />
                <button onClick={() => handleSaveField('firstName')} className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
                  Save
                </button>
              </div>
            ) : (
              <div className='flex justify-between items-center'>
                <div className='bg-gray-700 p-2 rounded w-3/4'>{firstName || 'Not set'}</div>
                <button onClick={() => setIsEditingField((prev) => ({ ...prev, firstName: true }))} className='bg-gray-600 px-4 py-2 rounded hover:bg-gray-700'>
                  Edit
                </button>
              </div>
            )}
          </div>
          <div>
            <label className='text-gray-400'>Last Name:</label>
            {isEditingField.lastName ? (
              <div className='flex space-x-2'>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className='w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' />
                <button onClick={() => handleSaveField('lastName')} className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
                  Save
                </button>
              </div>
            ) : (
              <div className='flex justify-between items-center'>
                <div className='bg-gray-700 p-2 rounded w-3/4'>{lastName || 'Not set'}</div>
                <button onClick={() => setIsEditingField((prev) => ({ ...prev, lastName: true }))} className='bg-gray-600 px-4 py-2 rounded hover:bg-gray-700'>
                  Edit
                </button>
              </div>
            )}
          </div>
          {isLoggedIn && (
            <button onClick={handleLogout} className='w-full bg-red-500  px-4 py-2 rounded hover:bg-red-600'>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
