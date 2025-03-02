import { get, query, orderByChild, equalTo, set, ref } from 'firebase/database';
import { encodeEmail } from '../utils/emailUtils';
import { db } from '../config/firebase-config';

export const getUserByEmail = async (email) => {
  const encodedEmail = encodeEmail(email);
  const snapshot = await get(ref(db, `users/${encodedEmail}`));

  if (snapshot.exists()) {
    return snapshot.val();
  }
};

export const getUserByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));

  if (snapshot.exists()) {
    return snapshot.val();
  }
};

export const createUserHandle = async (username, firstName, lastName, uid, email) => {
  if (!username || !uid || !email) {
    throw new Error('Invalid parameters for createUserHandle: username, uid, and email are required.');
  }

  const user = {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn: new Date().toISOString(),
    profilePicture: '',
  };

  await set(ref(db, `users/${username}`), user);
};

export const getUserData = async (username) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('username'), equalTo(username)));

  if (snapshot.exists()) {
    return snapshot.val();
  }
};

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  const usersData = snapshot.val();

  if (usersData) {
    return Object.keys(usersData).map((userId) => {
      const user = usersData[userId];
      return {
        id: user.uid,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        photoURL: user.photoURL || null,
      };
    });
  }

  return [];
};
