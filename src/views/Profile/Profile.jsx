import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, update, onValue, set } from 'firebase/database';
import { AppContext } from '../../store/app-context';
import { auth, db } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import SideBar from '../../components/UI/SideBar/SideBar';
import ViewStatus from '../ViewStatus/ViewStatus';

export default function Profile() {
  const { userData } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState('');
  const { username } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    gender: '',
    birthdate: { day: '', month: '', year: '' },
    bio: '',
    username: '',
    email: '',
  });
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  

  useEffect(() => {
      const userRef = ref(db, `users/${username}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          gender: data?.gender || '',
          birthdate: data?.birthdate || { day: '', month: '', year: '' },
          bio: data?.bio || '',
          username: data.username,
          email: data.email,
        });
        setProfilePicture(data?.profilePicture || '');
      });

      return () => unsubscribe();

  }, [username]);
    if (!userData) {
    return null;
  }

  const updateUserStatus = (username, status) => {
      const userStatusRef = ref(db, 'status/' + username);
      set(userStatusRef, { status: status });
    };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      
      updateUserStatus(userData.username, 'offline');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = {
        ...formData,
        profilePicture,
      };

      const userRef = ref(db, `users/${userData.username}`);
      await update(userRef, updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (birthdate) => {
    if (birthdate?.year && birthdate?.month && birthdate?.day) {
      const today = new Date();
      const birthDate = new Date(birthdate.year, birthdate.month - 1, birthdate.day);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'day' || name === 'month' || name === 'year') {
      setFormData((prev) => ({
        ...prev,
        birthdate: { ...prev.birthdate, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className='flex flex-grow items-center bg-gray-900'>
      <SideBar type='menu' />
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-prose mx-auto'>
        <div className='flex flex-col items-center'>
          <img src={profilePicture || '/images/123.jpg'} alt='Profile' className='w-40 h-40 rounded-full cursor-pointer' onClick={() => fileInputRef.current.click()} />
          <input type='file' ref={fileInputRef} className='hidden' onChange={handleProfilePictureChange} />
        </div>
        <div>
          <ViewStatus username={username} />
        </div>
        <div className='flex flex-row mt-6 space-y-4 justify-between'>
          <div className='mr-6'>
          <div>
            <label className='text-gray-400'>Username:</label>
            <div className='bg-gray-700 p-2 rounded'>{formData.username}</div>
          </div>
          <div>
            <label className='text-gray-400'>Email:</label>
            <div className='bg-gray-700 p-2 rounded'>{formData.email}</div>
          </div>

          {/* First Name */}
          <div>
            <label className='text-gray-400'>First Name:</label>
            <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} disabled={!isEditing} className='bg-gray-700 p-2 rounded w-full' />
          </div>

          {/* Last Name */}
          <div>
            <label className='text-gray-400'>Last Name:</label>
            <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} disabled={!isEditing} className='bg-gray-700 p-2 rounded w-full' />
          </div>

          {/* Age */}
          <div>
            <label className='text-gray-400'>Age:</label>
            <input type='text' value={calculateAge(formData.birthdate)} disabled className='bg-gray-700 p-2 rounded w-full' />
          </div>
          </div>
          <div>
          {/* Phone */}
          <div>
            <label className='text-gray-400'>Phone:</label>
            <input type='text' name='phone' value={formData.phone} onChange={handleChange} disabled={!isEditing} className='bg-gray-700 p-2 rounded w-full' />
          </div>

          {/* Gender */}
          <div>
            <label className='text-gray-400'>Gender:</label>
            <select name='gender' value={formData.gender} onChange={handleChange} disabled={!isEditing} className='bg-gray-700 p-2 rounded w-full'>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </div>

          {/* Birthdate */}
          <div>
            <label className='text-gray-400'>Birthdate:</label>
            <div className='flex space-x-2 pt-0.5'>
              <input type='number' name='day' value={formData.birthdate.day} onChange={handleChange} placeholder='Day' disabled={!isEditing} className='bg-gray-700 p-2 rounded w-16' />
              <input type='number' name='month' value={formData.birthdate.month} onChange={handleChange} placeholder='Month' disabled={!isEditing} className='bg-gray-700 p-2 rounded w-16' />
              <input type='number' name='year' value={formData.birthdate.year} onChange={handleChange} placeholder='Year' disabled={!isEditing} className='bg-gray-700 p-2 rounded w-24' />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className='text-gray-400'>Bio:</label>
            <textarea name='bio' value={formData.bio} onChange={handleChange} disabled={!isEditing} className='bg-gray-700 p-2 rounded w-full min-h-[12vh] overflow-auto' />
          </div>
          </div>
        </div>
        <div className='mt-6 text-center'>
          {isEditing ? (
            <button onClick={handleSaveProfile} className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition mr-2'>
              Save Profile
            </button>
          ) : (
            userData.username === username && <button onClick={() => setIsEditing(true)} className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition mr-2'>
              Edit Profile
            </button>
          )}
          {userData.username === username && (
            <button onClick={handleLogout} className='bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition'>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
