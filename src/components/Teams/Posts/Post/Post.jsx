import { useState } from 'react';
import Button from '../../../UI/Button/Button';
import CommentWindow from '../../Comments/CommentWindow/CommentWindow';
import AvatarAndUsername from '../../../UI/CommPostAdditionalInfo/CommPostAdditionalInfo';

export default function Post({ post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <section className='mb-5'>
        <h3 className='text-4xl'>{post.title}</h3>
        <AvatarAndUsername obj={post} />
      </section>
      <p className='text-xl break-words whitespace-normal bg-gray-800 p-2 rounded-md mb-5 mx-6'>{post.content}</p>
      <section>
        <Button onClick={() => setShowComments(!showComments)}>{showComments ? 'Hide Comments' : 'Show Comments'}</Button>
        {showComments && <CommentWindow post={post} />}
      </section>
    </>
  );
}
