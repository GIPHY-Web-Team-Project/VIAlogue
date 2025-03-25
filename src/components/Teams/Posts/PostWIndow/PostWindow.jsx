import { useEffect, useState } from 'react';
import { getChannelPosts } from '../../../../services/posts.services';
import Post from '../Post/Post';

export default function PostWindow({ channel }) {
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

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <Post post={post} onPostUpdate={handlePostUpdate} handlePostDelete={handlePostDelete} />
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}
