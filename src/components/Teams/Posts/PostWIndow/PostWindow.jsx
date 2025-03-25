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

  // console.log(posts);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className='border-4 shadow-lg p-2 rounded-md border-gray-800 mb-5'>
            <Post post={post} />
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}
