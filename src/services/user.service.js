import { get, query, orderByChild, equalTo, set, ref, update } from "firebase/database";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { db, storage, storageRef } from "../config/firebase.config";

export const getUserByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  return snapshot.val();
};

export const createUserHandle = async (username, uid, email, isAdmin = false) => {
  if (!username || !uid || !email) {
    throw new Error("Invalid parameters for createUserHandle: username, uid, and email are required.");
  }

  const user = {
    uid,
    email,
    username,
    isAdmin,
    createdOn: new Date().toISOString(),
  };

  await set(ref(db, `users/${username}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
  const data = snapshot.val();

  if (data) {
    const userIdKey = Object.keys(data)[0];
    return { ...data[userIdKey], photoURL: data[userIdKey].photoURL || null };
  }

  return null;
};

export const uploadProfilePicture = async (file, uid, username) => {
  const storagePathRef = storageRef(storage, `profilePictures/${uid}`);
  await uploadBytes(storagePathRef, file);
  const downloadURL = await getDownloadURL(storagePathRef);

  const userRef = ref(db, `users/${username}`);
  await update(userRef, { photoURL: downloadURL });

  return downloadURL;
};

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, "users"));
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