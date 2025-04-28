import React from 'react';
import PropTypes from 'prop-types';

export default function CommPostBtns({ showBtns, setIsEditing, handleDelete, objId }) {
  return (
    <div>
      {showBtns && (
        <>
          <span className='text-2xl hover:cursor-pointer hover:ring rounded-md' onClick={() => setIsEditing(true)}>
            ✏
          </span>
          <span className='text-2xl hover:cursor-pointer hover:ring rounded-md' onClick={() => handleDelete(objId)}>
            ❌
          </span>
        </>
      )}
    </div>
  );
}

CommPostBtns.propTypes = {
  showBtns: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  objId: PropTypes.string.isRequired,
};
