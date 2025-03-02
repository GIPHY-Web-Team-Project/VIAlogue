import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const loginUser = async (email, password) => {
  // await setPersistence(auth, browserLocalPersistence);
  return await signInWithEmailAndPassword(auth, email, password);
};
