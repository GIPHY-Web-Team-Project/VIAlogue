import { useContext } from 'react';
import { AppContext } from '../../../../store/app-context';
import { uploadPost } from '../../../../services/posts.services';
import TitleInput from '../../../UI/TitleInput/TitleInput';
import ContentInput from '../../../UI/ContentInput/ContentInput';
import Button from '../../../UI/Button/Button';
import { useParams } from 'react-router';

export default function CreatePost({ channelId }) {
  const { userData } = useContext(AppContext);
  const { teamId } = useParams();

  const handleCreatePost = async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
      alert('Please fill all fields');
      return;
    }

    if (title.trim().length < 16 || title.trim().length > 64) {
      alert('Title must be between 16 and 64 characters');
      return;
    }

    if (content.trim().length < 32 || content.trim().length > 8192) {
      alert('Content must be between 32 and 8192 characters');
      return;
    }

    try {
      await uploadPost(userData.username, title, content, channelId, teamId);
    } catch (error) {
      console.error(error);
      alert('Failed to upload post!');
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      <section>
        <TitleInput />
        <ContentInput />
        <Button onClick={() => handleCreatePost()}>Submit</Button>
      </section>
    </div>
  );
}
