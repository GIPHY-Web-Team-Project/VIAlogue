import { useState } from 'react';
import Button from '../../../UI/Button/Button';

export default function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  return (
    <>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <section>
        <Button onClick={() => setShowComments(!showComments)}>{showComments ? 'Hide Comments' : 'Show Comments'}</Button>
        {showComments && 'comments'}
      </section>
    </>
  );
}
