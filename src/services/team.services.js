import { equalTo, get, onValue, orderByChild, push, query, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { createChannel } from './channel.services';

export const createTeam = async (title, owner, members, callback) => {
  const teamsRef = ref(db, 'teams');
  const teamsTitleQuery = query(teamsRef, orderByChild('title'), equalTo(title));

  const snapshot = await get(teamsTitleQuery);
  if (snapshot.exists()) {
    throw new Error('Team with this title already exists!');
  } else {
    const team = {
      title,
      owner,
      members,
      avatar: '',
    };

    const result = await push(teamsRef, team);
    const id = result.key;
    await update(ref(db, `teams/${id}`), { id });
    await createChannel('general', { title, id: id }, members, owner);
    return callback(id);
  }
};

export const getTeamsByUsername = async (username, callback) => {
  if (!username) return;

  const teamsRef = ref(db, 'teams');

  const unsubscribe = onValue(teamsRef, (snapshot) => {
    if (snapshot.exists()) {
      const teams = snapshot.val();
      const filteredTeams = Object.values(teams).filter((team) => team.members.some((member) => member === username));

      callback(filteredTeams);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};

export const getTeamById = async (teamId, callback) => {
  const teamRef = ref(db, `teams/${teamId}`);

  const unsubscribe = onValue(teamRef, (snapshot) => {
    if (snapshot.exists()) {
      const team = snapshot.val();
      callback(team);
    } else {
      callback(null);
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
