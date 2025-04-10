import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { getUserByUsername } from '../../../services/user.service';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import defaultAvatar from '../../../../public/images/123.jpg';

export default function CommPostAdditionalInfo({ obj }) {
  const [avatarSrc, setAvatarSrc] = useState(null);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    if (userData.username === obj.author) {
      setAvatarSrc(userData.profilePicture);
    } else {
      const fn = async () => {
        const uploader = await getUserByUsername(obj.author);
        setAvatarSrc(uploader.profilePicture);
      };

      fn();
    }
  }, []);

  const handleProfileView = () => {
    navigate(`/profile/${obj.author}`);
  };

  return (
    <div className='flex items-center'>
      <section className='flex items-center mr-2'>
        <img className='mr-2 h-10 w-10 rounded-full overflow-hidden hover:cursor-pointer bg-gray-100' src={avatarSrc || defaultAvatar} alt={obj.author} onClick={handleProfileView} />
        <h3 className='text-lg hover:cursor-pointer' onClick={handleProfileView}>
          {obj.author}
        </h3>
      </section>
      <span className='text-xs'>{obj.createdOn.slice(4, 21)}</span>
    </div>
  );
}

CommPostAdditionalInfo.propTypes = {
  obj: PropTypes.object.isRequired,
};
