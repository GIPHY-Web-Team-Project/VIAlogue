import { onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const uploadComment = async (author, postId, content) => {
  const comment = {
    author,
    postId,
    content,
    createdOn: new Date().toString(),
  };

  const result = await push(ref(db, 'comments'), comment);
  const id = result.key;
  await update(ref(db, `comments/${id}`), { id });
  await update(ref(db, `posts/${postId}/comments/${id}`), { [id]: true });
};

export const deleteComment = async () => {};

export const getAllComments = async (postId, callback) => {
  const commentsRef = ref(db, 'comments');
  const unsubscribe = onValue(commentsRef, (snapshot) => {
    if (snapshot.exists()) {
      const comments = snapshot.val();
      const filteredComments = Object.values(comments).filter((comment) => comment.postId === postId);
      callback(filteredComments);
    } else {
      callback([]);
    }
  });
  return unsubscribe;
};
