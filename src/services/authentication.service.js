import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { createUserHandle } from "./user.service";

export const registerUser = async (email, password, username) => {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await createUserHandle(username, user.uid, email);

  return userCredential;
};

export const loginUser = async (email, password) => {
  await setPersistence(auth, browserLocalPersistence);
  return await signInWithEmailAndPassword(auth, email, password);
};