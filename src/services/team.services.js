import { onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createTeam = async (title, owner, members, callback) => {
  const team = {
    title,
    owner,
    members,
    channels: [],
  };

  const result = await push(ref(db, 'teams'), team);
  const id = result.key;
  await update(ref(db, `teams/${id}`), { id });
  return callback(id);
};

export const getTeamsByUserId = async (userId, callback) => {
  console.log('Fetching teams for user:', userId);
  const teamsRef = ref(db, 'teams');

  const unsubscribe = onValue(teamsRef, (snapshot) => {
    if (snapshot.exists()) {
      const teams = snapshot.val();
      const filteredTeams = Object.values(teams).filter((team) => team.members.some((member) => member.uid === userId));

      callback(filteredTeams);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};

export const updateTeam = async (teamId, updatedTeam) => {
  await update(ref(db, `teams/${teamId}`), updatedTeam);
};

// export const getTeamByTitle = async (title, callback) => {
//  query to get team by title
// };
