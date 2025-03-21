import { useNavigate } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';

export default function Team({ team }) {
  const navigate = useNavigate();

  return (
    <li onClick={() => navigate(`/teams/${team.id}`)} className='flex flex-col items-center bg-gray-700 px-10 py-4 rounded-lg cursor-pointer'>
      <img src={team.image} alt={team.title} className='w-50 h-50 rounded-full' />
      <h3 className='text-4xl'>{team.title}</h3>
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
