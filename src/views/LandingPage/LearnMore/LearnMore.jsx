import { useNavigate } from 'react-router';
import Button from '../../../components/UI/Button/Button';
import React from 'react';
import PropTypes from 'prop-types';
import { LEARNMORE_LIST_ITEM } from '../../../common/constants';
import { START_CHATTING } from '../../../common/enums';

/**
 * LearnMore component displays information about the features of VIALOGUE
 * and provides a button to navigate to the registration page.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setLearnMore - A function to update the state of the parent component
 *                                        indicating whether the LearnMore component is visible.
 *
 * @returns {JSX.Element} The rendered LearnMore component.
 */
export default function LearnMore({ setLearnMore }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
    setLearnMore(false);
  };

  return (
    <div className='flex flex-col items-center z-10 bg-gray-800 px-10 pb-5 pt-2 rounded-lg max-w-6xl mt-15'>
      <h3 className='text-6xl font-bold'>VIALOGUE</h3>
      <h5 className='text-3xl font-bold'>allows you to:</h5>
      <ul className='text-2xl list-disc flex flex-col gap-2'>
        <li className={LEARNMORE_LIST_ITEM}>Create teams with your friends!</li>
        <li className={LEARNMORE_LIST_ITEM}>Post inside team channels and leave comments for your teammates!</li>
        <li className={LEARNMORE_LIST_ITEM}>If outside of a team, you can chat with other users via chats!</li>
        <li className={`${LEARNMORE_LIST_ITEM} border-none`}>Chats and teams are both great but there is an alternative - you can add several people when creating a chat!</li>
      </ul>
      <div>
        <Button btnStyle={START_CHATTING} onClick={handleClick}>
          Start chatting!
        </Button>
      </div>
    </div>
  );
}

LearnMore.propTypes = {
  setLearnMore: PropTypes.func.isRequired,
};
