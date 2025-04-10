import { push, ref, remove, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { createChat } from './chat.services';

export const createChannel = async (title, team, members, owner) => {
  const newChannel = {
    title,
    members,
    owner,
    teamId: team.id,
  };

  const result = await push(ref(db, `teams/${team.id}/channels`), newChannel);
  const id = result.key;
  await update(ref(db, `teams/${team.id}/channels/${id}`), { id });
  await createChat(members, `Team: ${team.title}-${title}`, (id) => id);
};

export const removeChannel = async (teamId, channelId) => {
  await remove(ref(db, `teams/${teamId}/channels/${channelId}`));
};

export const updateChannel = async (teamId, channelId, updatedChannel) => {
  await update(ref(db, `teams/${teamId}/channels/${channelId}`), updatedChannel);
};
