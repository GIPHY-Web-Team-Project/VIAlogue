import { useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import CreatePost from '../CreatePost/CreatePost';
import { getChannelPosts } from '../../../../services/posts.services';

export default function PostWindow({ channel }) {
  const [viewCreatePost, setViewCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!channel) return;

    const unsubscribe = getChannelPosts(channel.id, channel.teamId, setPosts);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [channel]);

  console.log(posts);

  return (
    <div>
      <h1>Post Window</h1>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
      <Button onClick={() => setViewCreatePost(true)}>Upload a Post</Button>
      {viewCreatePost && <CreatePost channelId={channel.id} setViewCreatePost={setViewCreatePost} />}
    </div>
  );
}
