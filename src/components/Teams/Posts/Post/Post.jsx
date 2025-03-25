import React, { useContext, useState } from 'react';
import { AppContext } from '../../../../store/app-context';
import Button from '../../../UI/Button/Button';
import CommentWindow from '../../Comments/CommentWindow/CommentWindow';
import AvatarAndUsername from '../../../UI/CommPostAdditionalInfo/CommPostAdditionalInfo';
import { deletePost, updatePost } from '../../../../services/posts.services';
import CommPostBtns from '../../../UI/CommPostBtns/CommPostBtns';
import EditForm from '../../../UI/EditForm/EditForm';
import { POST } from '../../../../common/enums';
import PropTypes from 'prop-types';
import Modal from '../../../UI/Modal/Modal';

export default function Post({ post, onPostUpdate, handlePostDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    content: post.content,
  });
  const [showBtns, setShowBtns] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { userData } = useContext(AppContext);

  const handleInputChange = (e) => {
    setEditedPost({
      ...editedPost,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!editedPost.content || !editedPost.title) {
      setModalMessage('Content cannot be empty.');
      setShowModal(true);
      return;
    }
    try {
      await updatePost(post.id, editedPost.title, editedPost.content);

      if (onPostUpdate) {
        onPostUpdate({ ...post, ...editedPost });
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post', error);
      setModalMessage('Post could not be updated. Please try again later.');
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(post.id, id);

      if (handlePostDelete) {
        handlePostDelete(post.id);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Post could not be deleted. Please try again later.');
      setShowModal(true);
    }
  };

  return (
    <div className='bg-gray-700 shadow-lg p-6 rounded-md  mb-5' onMouseEnter={() => setShowBtns(true)} onMouseLeave={() => setShowBtns(false)}>
      {isEditing ? (
        <EditForm editedObj={editedPost} setIsEditing={setIsEditing} handleInputChange={handleInputChange} handleSave={handleSave} type={POST} />
      ) : (
        <>
          <div className='flex flex-col border-b-4 border-gray-600 mb-6'>
            <section className='flex justify-between mb-5'>
              <div>
                <AvatarAndUsername obj={post} />
                <h3 className='text-4xl mt-4 ml-10'>{post.title}</h3>
              </div>
              <div>{userData && userData.username === post.author && <CommPostBtns showBtns={showBtns} setIsEditing={setIsEditing} handleDelete={handleDelete} objId={post.id} />}</div>
            </section>
            <p className='text-xl break-words whitespace-normal p-2 rounded-md mb-5 mx-6 p-4'>{post.content}</p>
          </div>
          <section>
            <Button onClick={() => setShowComments(!showComments)}>{showComments ? 'Hide Comments' : 'Show Comments'}</Button>
            {showComments && <CommentWindow post={post} />}
          </section>
        </>
      )}
      {showModal && <Modal message={modalMessage} show={showModal} handleClose={() => setShowModal(false)} />}
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onPostUpdate: PropTypes.func,
  handlePostDelete: PropTypes.func,
};
