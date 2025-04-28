import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, update, onValue, set } from 'firebase/database';
import { AppContext } from '../../store/app-context';
import { auth, db } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import SideBar from '../../components/UI/SideBar/SideBar';
import ViewStatus from '../ViewStatus/ViewStatus';
import Modal from '../../components/UI/Modal/Modal';
import defaultAvatar from '../../../public/images/123.jpg';
import Button from '../../components/UI/Button/Button';
import { CANCEL, EDIT_PROFILE, LOGOUT } from '../../common/enums';

/**
 * Profile component that displays and allows editing of user profile information.
 *
 * @component
 * @returns {JSX.Element} The rendered Profile component.
 *
 * @description
 * This component fetches and displays user profile data, including profile picture,
 * personal details, and bio. It allows the user to edit their profile information
 * and save changes. Additionally, it provides options for initiating a chat or
 * video call with another user.
 *
 * @requires useContext - To access the `AppContext` for user data.
 * @requires useRef - To manage the file input for profile picture upload.
 * @requires useState - To manage component state for profile data and editing mode.
 * @requires useEffect - To fetch user data from the database on component mount.
 * @requires useParams - To retrieve the username from the URL parameters.
 * @requires useNavigate - To navigate between routes.
 *
 * @function calculateAge
 * @param {Object} birthdate - The user's birthdate object containing day, month, and year.
 * @returns {number|string} The calculated age or an empty string if birthdate is incomplete.
 *
 * @function handleLogout
 * Logs the user out, updates their status to "offline", and navigates to the login page.
 *
 * @function handleSaveProfile
 * Saves the updated profile data to the database and exits editing mode.
 *
 * @function handleProfilePictureChange
 * Handles the profile picture upload and updates the state with the new image.
 *
 * @function handleChange
 * Updates the form data state when input fields are changed.
 *
 * @function updateUserStatus
 * @param {string} username - The username of the user.
 * @param {string} status - The new status to set for the user.
 * Updates the user's status in the database.
 *
 * @state {Object} formData - The user's profile data, including name, contact info, and bio.
 * @state {string} profilePicture - The URL or base64 string of the user's profile picture.
 * @state {boolean} isEditing - Indicates whether the profile is in editing mode.
 *
 * @example
 * // Render the Profile component
 * <Profile />
 */
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
      setModalMessage(`We could not log you out. Please try again later!`);
      setShowModal(true);
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
      setModalMessage(`We could not update your profile. Please try again later!`);
      setShowModal(true);
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
    <div className='flex flex-grow items-center bg-gray-800 min-h-screen'>
      <SideBar type='menu' />
      <div className='bg-gray-700 p-4 md:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto my-4'>
        <div className='flex flex-col items-center'>
          <div className='flex items-center'>
            <img src={profilePicture || defaultAvatar} alt='Profile' className='w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer' onClick={() => fileInputRef.current.click()} />
          </div>
          <input type='file' ref={fileInputRef} className='hidden' onChange={handleProfilePictureChange} />
        </div>
        <div className='text-center mt-4 flex flex-row justify-center'>
          <ViewStatus username={username} source='profile-details' />
        </div>
        <div className='flex flex-col md:flex-row mt-6 space-y-4 md:space-y-0 md:space-x-4 justify-between'>
          <div className='w-full md:w-1/2'>
            <div className='mb-4'>
              <label className='text-gray-400'>Username:</label>
              <div className='bg-gray-800 p-2 rounded'>{formData.username}</div>
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>Email:</label>
              <div className='bg-gray-800 p-2 rounded'>{formData.email}</div>
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>First Name:</label>
              <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} disabled={!isEditing} className='bg-gray-800 p-2 rounded w-full' />
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>Last Name:</label>
              <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} disabled={!isEditing} className='bg-gray-800 p-2 rounded w-full' />
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>Age:</label>
              <input type='text' value={calculateAge(formData.birthdate)} disabled className='bg-gray-800 p-2 rounded w-full' />
            </div>
          </div>
          <div className='w-full md:w-1/2'>
            <div className='mb-4'>
              <label className='text-gray-400'>Phone:</label>
              <input type='text' name='phone' value={formData.phone} onChange={handleChange} disabled={!isEditing} className='bg-gray-800 p-2 rounded w-full' />
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>Gender:</label>
              <select name='gender' value={formData.gender} onChange={handleChange} disabled={!isEditing} className='bg-gray-800 p-2 rounded w-full'>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>Birthdate:</label>
              <div className='flex space-x-2 pt-0.5'>
                <input type='number' name='day' value={formData.birthdate.day} onChange={handleChange} placeholder='Day' disabled={!isEditing} className='bg-gray-800 p-2 rounded w-16' />
                <input type='number' name='month' value={formData.birthdate.month} onChange={handleChange} placeholder='Month' disabled={!isEditing} className='bg-gray-800 p-2 rounded w-16' />
                <input type='number' name='year' value={formData.birthdate.year} onChange={handleChange} placeholder='Year' disabled={!isEditing} className='bg-gray-800 p-2 rounded w-24' />
              </div>
            </div>
            <div className='mb-4'>
              <label className='text-gray-400'>Bio:</label>
              <textarea name='bio' value={formData.bio} onChange={handleChange} disabled={!isEditing} className='bg-gray-800 p-2 rounded w-full min-h-[12vh] overflow-auto' />
            </div>
          </div>
        </div>
        <div className='mt-6 text-center'>
          {isEditing ? (
            <>
            <Button onClick={handleSaveProfile} btnStyle={EDIT_PROFILE}>
              Save changes
            </Button>
            <Button onClick={() => setIsEditing(false)} btnStyle={CANCEL}>
              Cancel
            </Button>
            </>
          ) : (
            userData.username === username && (
              <>
                <Button onClick={() => setIsEditing(true)} btnStyle={EDIT_PROFILE}>
                  Edit profile
                </Button>
                <Button onClick={handleLogout} btnStyle={LOGOUT}>
                  Logout
                </Button>
              </>
            )
          )}
        </div>
      </div>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
}
