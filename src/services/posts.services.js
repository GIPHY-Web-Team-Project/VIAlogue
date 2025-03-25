import { onValue, push, ref, remove, update } from 'firebase/database';
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

export const deletePost = async (postId, id) => {
  await remove(ref(db, `posts/${id}`));
  await remove(ref(db, `comments/${postId}/comments/${id}`));
};

export const getChannelPosts = async (channelId, teamId, callback) => {
  const channelPostsRef = ref(db, `teams/${teamId}/channels/${channelId}/posts`);

  onValue(channelPostsRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const postIds = Object.keys(snapshot.val());
    const posts = [];

    for (const postId of postIds) {
      const postRef = ref(db, `posts/${postId}`);
      await new Promise((resolve) => {
        onValue(postRef, (postSnapshot) => {
          if (postSnapshot.exists()) {
            const post = postSnapshot.val();
            if (!posts.some((p) => p.id === post.id)) {
              posts.push(post);
            }
          }
          resolve();
        });
      });
    }

    posts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

    callback(posts);
  });
};
