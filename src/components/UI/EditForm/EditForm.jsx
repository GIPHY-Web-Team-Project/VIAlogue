import { POST } from '../../../common/enums';
import PropTypes from 'prop-types';
import React from 'react';

export default function EditForm({ editedObj, setIsEditing, handleInputChange, handleSave, type }) {
  return (
    <div className='flex items-center'>
      {type === POST ? (
        <div className=''>
          <label htmlFor='title'>Post title: </label>
          <input id='title' name='title' value={editedObj.title} onChange={handleInputChange} />
          <label htmlFor='content'>Post content: </label>
          <textarea name='content' value={editedObj.content} onChange={handleInputChange} />
        </div>
      ) : (
        <div className='flex flex-col'>
          <label htmlFor='content' className='text-2xl border-b border-gray-700 shadow-sm mb-4'>
            Edit comment:
          </label>
          <textarea name='content' className=' w-[15vw] h-[20vh] border-2 border-gray-700' value={editedObj.content} onChange={handleInputChange} />
        </div>
      )}
      <div>
        <span className='hover:cursor-pointer text-xl' onClick={handleSave}>
          ✔
        </span>
        <span className='hover:cursor-pointer text-xl' onClick={() => setIsEditing(false)}>
          ❌
        </span>
      </div>
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
