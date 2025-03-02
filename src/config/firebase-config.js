// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDibx2pzJtQC7odPBTISGDoEWxu-TN2bbU',
  authDomain: 'vialogue-7e44f.firebaseapp.com',
  projectId: 'vialogue-7e44f',
  storageBucket: 'vialogue-7e44f.firebasestorage.app',
  messagingSenderId: '629106025991',
  appId: '1:629106025991:web:a82ff75053ec284ec5eca2',
  measurementId: 'G-7GN58TBCYE',
  databaseURL: 'https://vialogue-7e44f-default-rtdb.europe-west1.firebasedatabase.app',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const databaseURL = firebaseConfig.databaseURL;
// const analytics = getAnalytics(app);
