import React from 'react';
import Button from '../Button/Button';
import PropTypes from 'prop-types';

const Modal = ({ show, handleClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative flex flex-col'>
        <p className='text-lg text-white-200'>{message}</p>
        <Button onClick={handleClose}>Close</Button>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
