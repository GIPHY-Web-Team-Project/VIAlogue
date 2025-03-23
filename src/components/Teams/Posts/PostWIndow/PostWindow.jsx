import { useEffect, useState } from 'react';
import Button from '../../../UI/Button/Button';
import CreatePost from '../CreatePost/CreatePost';
import { getChannelPosts } from '../../../../services/posts.services';
import Post from '../Post/Post';

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

  // console.log(posts);

  return (
    <div className='flex flex-col'>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className=''>
            <Post post={post} />
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
