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
            <div key={comment.id} className='flex flex-col bg-gray-800 mt-3 border-1 rounded-md border-gray-700 py-2 px-3'>
              <Comment comment={comment} />
            </div>
          ))}
      </section>
      <LeaveComment post={post} />
    </div>
  );
}
