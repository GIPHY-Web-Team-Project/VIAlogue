import React from 'react';

const Modal = ({ show, handleClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative flex flex-col">
        <p className="text-lg text-white-200">{message}</p>
        <button 
          onClick={handleClose} 
          className="btn align-center text-center absolute bottom-4 right-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
