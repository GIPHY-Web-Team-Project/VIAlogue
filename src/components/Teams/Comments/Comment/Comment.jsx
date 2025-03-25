import { useContext, useState } from 'react';
import CommPostAdditionalInfo from '../../../UI/CommPostAdditionalInfo/CommPostAdditionalInfo';
import { AppContext } from '../../../../store/app-context';
import Button from '../../../UI/Button/Button';
import { TEXT_BUTTON } from '../../../../common/enums';
import { updateComment } from '../../../../services/comments.services';

export default function Comment({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState({
    content: comment.content,
  });
  const { userData } = useContext(AppContext);

  const handleInputChange = (e) => {
    setEditedComment({
      ...editedComment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!editedComment.content) {
      alert('Content cannot be empty');
      // modal
      return;
    }
    try {
      await updateComment(comment.id, editedComment);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment', error);
      //   modal
    }
  };

  return (
    <>
      {isEditing ? (
        <div className='edit-form'>
          <textarea name='content' value={editedComment.content} onChange={handleInputChange} className='edit-content' />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <p className='break-words whitespace-normal max-w-3xl shadow-lg border-1 border-gray-700 rounded-md px-2 py-1 mb-2'>{comment.content}</p>
          <CommPostAdditionalInfo obj={comment} />
          {userData && userData.username === comment.author && (
            <div className='self-end'>
              <span className='hover:cursor-pointer hover:ring rounded-md' onClick={() => setIsEditing(true)}>
                ✏
              </span>
              <span className='hover:cursor-pointer hover:ring rounded-md' onClick={() => handleDelete(comment.id)}>
                ❌
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
