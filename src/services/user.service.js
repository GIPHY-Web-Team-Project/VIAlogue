import { get, query, orderByChild, equalTo, set, ref, onValue } from 'firebase/database';
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

/**
 * Creates a new user handle in the database.
 *
 * @async
 * @function createUserHandle
 * @param {string} username - The unique username for the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} uid - The unique identifier for the user.
 * @param {string} email - The email address of the user.
 * @throws {Error} Throws an error if any of the required parameters (username, uid, or email) are missing.
 * @returns {Promise<void>} A promise that resolves when the user handle is successfully created.
 */
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

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));

  if (snapshot.exists()) {
    return snapshot.val();
  }

  return null;
};

export const getAllUsers = async (callback) => {
  const usersRef = ref(db, 'users');

  const unsubscribe = onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(Object.values(snapshot.val()));
    } else {
      callback([]);
    }
  });

  return () => unsubscribe();
};
