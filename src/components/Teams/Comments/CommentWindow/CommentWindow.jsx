import { useEffect, useState } from 'react';
import LeaveComment from '../LeaveComment/LeaveComment';
import { getAllComments } from '../../../../services/comments.services';
import Comment from '../Comment/Comment';

export default function CommentWindow({ post }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!post) return;
    const fetchComments = async () => {
      const unsubscribe = getAllComments(post.id, setComments);
      return () => {
        unsubscribe();
      };
    };

    fetchComments();
  }, [post.id]);

  return (
    <div className='flex flex-col'>
      <section className='flex flex-col items-start'>
        {comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id} className='flex flex-col bg-gray-600 mt-3 rounded-md py-2 px-3 w-100'>
              <Comment comment={comment} post={post} />
            </div>
          ))}
      </section>
      <LeaveComment post={post} />
    </div>
  );
}
