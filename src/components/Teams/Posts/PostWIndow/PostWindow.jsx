import { useEffect, useState } from 'react';
import { getChannelPosts } from '../../../../services/posts.services';
import Post from '../Post/Post';
import React from 'react';
import PropTypes from 'prop-types';

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
        <p className='text-4xl h-[30vh]'>No posts available - start posting!</p>
      )}
    </div>
  );
}

PostWindow.propTypes = {
  channel: PropTypes.object.isRequired,
};
