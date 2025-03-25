import { useContext } from 'react';
import { AppContext } from '../../../../store/app-context';
import { uploadPost } from '../../../../services/posts.services';
import TitleInput from '../../../UI/TitleInput/TitleInput';
import ContentInput from '../../../UI/ContentInput/ContentInput';
import Button from '../../../UI/Button/Button';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

export default function CreatePost({ channelId, setViewCreatePost }) {
  const { userData } = useContext(AppContext);
  const { teamId } = useParams();

  const handleCreatePost = async () => {
    if (!userData) return;

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
      alert('Please fill all fields');
      return;
    }

    if (title.trim().length < 3 || title.trim().length > 64) {
      alert('Title must be between 3 and 64 characters');
      return;
    }

    if (content.trim().length < 10 || content.trim().length > 8192) {
      alert('Content must be between 10 and 8192 characters');
      return;
    }

    try {
      await uploadPost(userData.username, title, content, channelId, teamId);
    } catch (error) {
      console.error(error);
      alert('Failed to upload post!');
    }

    setViewCreatePost(false);
  };

  return (
    <section className='bg-gray-700'>
      <h1>Create Post</h1>
      <div className='flex gap-6'>
        <TitleInput />
        <ContentInput />
        <div className='flex items-center'>
          <Button onClick={() => handleCreatePost()}>Submit</Button>
          <Button onClick={() => setViewCreatePost(false)}>Cancel</Button>
        </div>
      </div>
    </section>
  );
}

CreatePost.propTypes = {
  channelId: PropTypes.string.isRequired,
  setViewCreatePost: PropTypes.func.isRequired,
};
