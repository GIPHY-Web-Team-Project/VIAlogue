import { useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import CreatePost from '../CreatePost/CreatePost';

export default function PostWindow({ channel }) {
  const [posts, setPosts] = useState([]);
  const [viewCreatePost, setViewCreatePost] = useState(false);

  const handleCreatePost = () => {};

  useEffect(() => {}, []);

  return (
    <div>
      <h1>Post Window</h1>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.body}</p>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
      <Button onClick={() => setViewCreatePost(true)}>Upload a Post</Button>
      {viewCreatePost && <CreatePost channelId={channel.id} />}
    </div>
  );
}
