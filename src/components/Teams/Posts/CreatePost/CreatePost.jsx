import { useContext, useState } from 'react';
import { AppContext } from '../../../../store/app-context';
import { uploadPost } from '../../../../services/posts.services';
import Button from '../../../UI/Button/Button';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../../UI/Modal/Modal';

export default function CreatePost({ channelId, setViewCreatePost }) {
  const { userData } = useContext(AppContext);
  const { teamId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCreatePost = async () => {
    if (!userData) return;

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
      setModalMessage('Please fill all fields');
      setShowModal(true);
      return;
    }

    if (title.trim().length < 3 || title.trim().length > 64) {
      setModalMessage('Title must be between 3 and 64 characters');
      setShowModal(true);
      return;
    }

    if (content.trim().length < 10 || content.trim().length > 8192) {
      setModalMessage('Content must be between 10 and 8192 characters');
      setShowModal(true);
      return;
    }

    try {
      await uploadPost(userData.username, title, content, channelId, teamId);
    } catch (error) {
      console.error(error);
      setModalMessage('Failed to upload post!');
      setShowModal(true);
    }

    setViewCreatePost(false);
  };

  return (
    <section className='bg-gray-700 flex flex-col items-center pb-6'>
      <h1 className='text-2xl py-4'>Create a Post</h1>
      <div className='grid'>
        <label htmlFor='title' className='mb-2 text-lg'>
          Title:
        </label>
        <input type='text' id='title' placeholder='Enter title' className='bg-gray-600 rounded-md mb-6 shadow-md w-[10vw] h-[5vh] text-xl p-3' />

        <label htmlFor='content' className='mb-2 text-lg'>
          Content:
        </label>
        <textarea id='content' placeholder='Enter content' className='bg-gray-600 rounded-md mb-6 shadow-md w-[30vw] h-[15vh] text-xl p-3' />

        <div className='flex items-center gap-3'>
          <Button onClick={() => handleCreatePost()}>Submit</Button>
          <Button onClick={() => setViewCreatePost(false)}>Cancel</Button>
        </div>
      </div>
      <Modal show={showModal} handleClose={handleClose} message={modalMessage} />
    </section>
  );
}

CreatePost.propTypes = {
  channelId: PropTypes.string.isRequired,
  setViewCreatePost: PropTypes.func.isRequired,
};
