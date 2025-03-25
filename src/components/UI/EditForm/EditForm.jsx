import React from 'react';
import { POST } from '../../../common/enums';
import PropTypes from 'prop-types';

export default function EditForm({ editedObj, setIsEditing, handleInputChange, handleSave, type }) {
  return (
    <div>
      {type === POST ? (
        <>
          <label htmlFor='title'>Post title</label>
          <input id='title' name='title' value={editedObj.title} onChange={handleInputChange} />
          <label htmlFor='content'>Post content</label>
          <textarea name='content' value={editedObj.content} onChange={handleInputChange} className='edit-content' />
        </>
      ) : (
        <>
          <label htmlFor='content'>Comment content</label>
          <textarea name='content' value={editedObj.content} onChange={handleInputChange} className='edit-content' />
        </>
      )}

      <span className='hover:cursor-pointer' onClick={handleSave}>
        ✔
      </span>
      <span className='hover:cursor-pointer' onClick={() => setIsEditing(false)}>
        ❌
      </span>
    </div>
  );
}

EditForm.propTypes = {
  editedObj: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
