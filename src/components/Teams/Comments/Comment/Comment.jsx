import { useContext, useState } from 'react';
import CommPostAdditionalInfo from '../../../UI/CommPostAdditionalInfo/CommPostAdditionalInfo';
import { AppContext } from '../../../../store/app-context';
import { deleteComment, updateComment } from '../../../../services/comments.services';
import CommPostBtns from '../../../UI/CommPostBtns/CommPostBtns';
import EditForm from '../../../UI/EditForm/EditForm';
import { COMMENT } from '../../../../common/enums';

export default function Comment({ comment, post }) {
  const [showBtns, setShowBtns] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState({
    content: comment.content,
  });

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

  const handleDelete = async (id) => {
    try {
      await deleteComment(post.id, id);
    } catch (error) {
      console.error(error);
      alert('Failed to delete comment!');
      //   modal
    }
  };

  const { userData } = useContext(AppContext);

  return (
    <>
      {isEditing ? (
        <EditForm editedObj={editedComment} setIsEditing={setIsEditing} handleInputChange={handleInputChange} handleSave={handleSave} type={COMMENT} />
      ) : (
        <>
          <div className='flex' onMouseEnter={() => setShowBtns(true)} onMouseLeave={() => setShowBtns(false)}>
            <section className='min-w-full mr-4'>
              <CommPostAdditionalInfo obj={comment} />
              <p className='break-words whitespace-normal shadow-sm rounded-md px-2 py-1 mb-2'>{comment.content}</p>
            </section>
            <div>{userData && userData.username === comment.author && <CommPostBtns showBtns={showBtns} setIsEditing={setIsEditing} handleDelete={handleDelete} objId={comment.id} />}</div>
          </div>
        </>
      )}
    </>
  );
}
