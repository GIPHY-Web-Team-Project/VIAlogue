import { useNavigate } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';

export default function Team({ team }) {
  const navigate = useNavigate();

  return (
    <li onClick={() => navigate(`/teams/${team.id}`)} className='flex flex-col max-h-80 max-w-sm hover:ring-1 items-center bg-gray-700 px-10 py-4 text-center rounded-lg cursor-pointer'>
      <img src={team.image} alt={team.title} className='w-50 h-50 rounded-full shadow-md' />
      <h3 className='text-4xl break-words whitespace-normal'>{team.title}</h3>
      <p>Members: {team.members.length}</p>
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
