import React from 'react';

const Modal = ({ show, handleClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>{message}</h2>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
