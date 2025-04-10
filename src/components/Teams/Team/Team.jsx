import { useNavigate } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';

export default function Team({ team }) {
  const navigate = useNavigate();

  const getInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const generateColor = (name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const generateAvatar = (name) => {
    const initials = getInitials(name);
    const colorClass = generateColor(name);

    return <div className={`${colorClass} w-[30vw] h-[30vw] max-w-32 max-h-32 sm:max-w-40 sm:max-h-40 md:max-w-48 md:max-h-48 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl font-bold shadow-lg`}>{initials}</div>;
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <li onClick={() => navigate(`/teams/${team.id}`)} className='flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-700 rounded-lg cursor-pointer hover:ring-2 transition-all duration-300 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl'>
      {isValidUrl(team.image) ? (
        <img
          src={team.image}
          alt={team.title}
          className='w-[30vw] h-[30vw] max-w-32 max-h-32 sm:max-w-40 sm:max-h-40 md:max-w-48 md:max-h-48 rounded-full object-cover aspect-square shadow-md'
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.insertBefore(generateAvatar(team.title), e.target);
          }}
        />
      ) : (
        generateAvatar(team.title)
      )}

      <div className='text-center sm:text-left flex flex-col items-center sm:items-start'>
        <h3 className='text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold break-words'>{team.title}</h3>
        <p className='text-sm sm:text-lg text-gray-300'>Members: {team.members.length}</p>
      </div>
    </li>
  );
}

Team.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
