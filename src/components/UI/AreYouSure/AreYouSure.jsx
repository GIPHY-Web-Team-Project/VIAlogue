import Button from '../Button/Button';
import React from 'react';
import PropTypes from 'prop-types';

export default function AreYouSure({ setShowSure, message, executeFn }) {
  const handleYes = async () => {
    await executeFn();
    setShowSure(false);
  };

  const handleNo = () => {
    setShowSure(false);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative flex flex-col'>
        <h3>{message}</h3>
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={handleNo}>No</Button>
      </div>
    </div>
  );
}

AreYouSure.propTypes = {
  setShowSure: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  executeFn: PropTypes.func.isRequired,
};
