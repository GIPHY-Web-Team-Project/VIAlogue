import React, { useContext, useState } from 'react';
import CommPostAdditionalInfo from '../../../UI/CommPostAdditionalInfo/CommPostAdditionalInfo';
import { AppContext } from '../../../../store/app-context';
import { deleteComment, updateComment } from '../../../../services/comments.services';
import CommPostBtns from '../../../UI/CommPostBtns/CommPostBtns';
import EditForm from '../../../UI/EditForm/EditForm';
import { COMMENT } from '../../../../common/enums';
import PropTypes from 'prop-types';
import Modal from '../../../UI/Modal/Modal';

export default function Comment({ comment, post }) {
  const { userData } = useContext(AppContext);
  const [showBtns, setShowBtns] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
      setModalMessage('Content cannot be empty!');
      setShowModal(true);
      return;
    }
    try {
      await updateComment(comment.id, editedComment);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setModalMessage('Comment could not be updated. Please try again later.');
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(post.id, id);
    } catch (error) {
      console.error(error);
      setModalMessage('Comment could not be deleted. Please try again later.');
      setShowModal(true);
    }
  };

  return (
    <>
      {isEditing ? (
        <EditForm editedObj={editedComment} setIsEditing={setIsEditing} handleInputChange={handleInputChange} handleSave={handleSave} type={COMMENT} />
      ) : (
        <>
          <div className='flex' onMouseEnter={() => setShowBtns(true)} onMouseLeave={() => setShowBtns(false)}>
            <section className='min-w-full mr-4'>
              <div className='flex justify-between'>
                <CommPostAdditionalInfo obj={comment} />
                {userData && userData.username === comment.author && <CommPostBtns showBtns={showBtns} setIsEditing={setIsEditing} handleDelete={handleDelete} objId={comment.id} />}
              </div>
              <p className='break-words whitespace-normal shadow-sm rounded-md px-2 py-1 mb-2'>{comment.content}</p>
            </section>
          </div>
        </>
      )}
    </>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};
