import { onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { createChat } from './chat.services';

export const getChannelsByTeamId = async (teamId, callback) => {
  const teamChannelsRef = ref(db, `teams/${teamId}/channels`);

  onValue(teamChannelsRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const channelIds = Object.keys(snapshot.val());
    const channels = [];

    for (const channelId of channelIds) {
      const channelRef = ref(db, `channels/${channelId}`);
      await new Promise((resolve) => {
        onValue(
          channelRef,
          (channelRef) => {
            if (channelRef.exists()) {
              channels.push(channelRef.val());
            }
            resolve();
          },
          { onlyOnce: true }
        );
      });
    }

    callback(channels);
  });
};

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

export const updateChannel = async (teamId, channelId, updatedChannel) => {
  await update(ref(db, `teams/${teamId}/channels/${channelId}`), updatedChannel);
};
