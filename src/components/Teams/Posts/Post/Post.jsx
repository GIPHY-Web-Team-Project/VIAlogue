import { useState } from 'react';
import Button from '../../../UI/Button/Button';
import CommentWindow from '../../Comments/CommentWindow/CommentWindow';

export default function Post({ post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <h3 className='mb-5 text-4xl'>{post.title}</h3>
      <p className='text-xl break-words whitespace-normal'>{post.content}</p>
      <section>
        <Button onClick={() => setShowComments(!showComments)}>{showComments ? 'Hide Comments' : 'Show Comments'}</Button>
        {showComments && <CommentWindow post={post} />}
      </section>
    </>
  );
}
