import { push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const uploadPost = async (author, title, content, channelId, teamId) => {
  const post = {
    author,
    title,
    content,
    createdOn: new Date().toString(),
  };

  const result = await push(ref(db, 'posts'), post);
  const id = result.key;
  await update(ref(db, `posts/${id}`), { id });
  await update(ref(db, `teams/${teamId}/channels/${channelId}/posts`), { [id]: true });
};

export const updatePost = async (id, title, content) => {
  await update(ref(db, `posts/${id}`), { title, content });
};

export const getChannelPosts = async (channelId, callback) => {};
