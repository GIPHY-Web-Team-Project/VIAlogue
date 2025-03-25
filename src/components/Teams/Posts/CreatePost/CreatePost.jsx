import React, { useContext, useState } from 'react';
import { AppContext } from '../../../../store/app-context';
import { uploadPost } from '../../../../services/posts.services';
import TitleInput from '../../../UI/TitleInput/TitleInput';
import ContentInput from '../../../UI/ContentInput/ContentInput';
import Button from '../../../UI/Button/Button';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import Modal from '../../../UI/Modal/Modal';

export default function CreatePost({ channelId, setViewCreatePost }) {
  const { userData } = useContext(AppContext);
  const { teamId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCreatePost = async () => {
    if (!userData) return;

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
      setModalMessage('Please fill in all fields.');
      setShowModal(true);
      return;
    }

    try {
      await uploadPost(userData.username, title, content, channelId, teamId);
    } catch (error) {
      console.error(error);
      setModalMessage('Your post could not be uploaded. Please try again later.');
      setShowModal(true);
      
    }

    setViewCreatePost(false);
  };

  return (
    <div>
      <h1>Create Post</h1>
      <section>
        <TitleInput />
        <ContentInput />
        <Button onClick={() => handleCreatePost()}>Submit</Button>
        <Button onClick={() => setViewCreatePost(false)}>Cancel</Button>
      </section>
      {showModal && <Modal message={modalMessage} show={showModal} handleClose={() => setShowModal(false)} />}
    </div>
  );
}

CreatePost.propTypes = {
  channelId: PropTypes.string.isRequired,
  setViewCreatePost: PropTypes.func.isRequired,
};
