import { useEffect, useState } from 'react';
import LeaveComment from '../LeaveComment/LeaveComment';
import { getAllComments } from '../../../../services/comments.services';

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
      <section>
        {comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <div>{comment.author}</div>
            </div>
          ))}
      </section>
      <LeaveComment post={post} />
    </div>
  );
}
