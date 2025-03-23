import { onValue, ref } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getAllUsers = (callback) => {
  const usersRef = ref(db, 'users');

  const subscribeUsers = onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    const totalUsers = users ? Object.keys(users).length : 0;
    callback(totalUsers);
  });

  return subscribeUsers;
};

export const getAllTeams = (callback) => {
  const teamsRef = ref(db, 'teams');

  const subscribeUsers = onValue(teamsRef, (snapshot) => {
    const teams = snapshot.val();
    const totalTeams = teams ? Object.keys(teams).length : 0;
    callback(totalTeams);
  });

  return subscribeUsers;
};
