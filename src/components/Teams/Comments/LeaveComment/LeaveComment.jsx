import { useContext, useState } from 'react';
import { LEAVE_COMMENT } from '../../../../common/enums';
import { uploadComment } from '../../../../services/comments.services';
import { AppContext } from '../../../../store/app-context';
import Modal from '../../../UI/Modal/Modal';
import Button from '../../../UI/Button/Button';
import React from 'react';
import PropTypes from 'prop-types';

export default function LeaveComment({ post }) {
  const { userData } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleLeaveComment = async () => {
    if (!userData) return;

    let content = document.getElementById('comment');

    if (content.value.length === 0) {
      setModalMessage(`Comment can't be empty!`);
      setShowModal(true);
      return;
    }

    try {
      await uploadComment(userData.username, post.id, content.value);
    } catch (error) {
      console.error(error);
      setModalMessage('Failed to upload post!');
      setShowModal(true);
    }

    content.value = '';
  };

  return (
    <div>
      <section className='flex flex-col max-w-lg'>
        <textarea className='mt-4 mb-2 border-4 p-2 border-gray-600 rounded-md' id='comment' placeholder='Enter comment' />
        <Button btnStyle={LEAVE_COMMENT} onClick={() => handleLeaveComment()}>
          Comment
        </Button>
      </section>
      {showModal && <Modal show={showModal} handleClose={() => setShowModal(false)} message={modalMessage} />}
    </div>
  );
}

LeaveComment.propTypes = {
  post: PropTypes.object.isRequired,
};
