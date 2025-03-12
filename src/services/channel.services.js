import { onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

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

export const createChannel = async (title, teamId, members, owner) => {
  const newChannel = {
    title,
    members,
    owner,
  };

  const result = await push(ref(db, `teams/${teamId}/channels`), newChannel);
  const id = result.key;
  await update(ref(db, `teams/${teamId}/channels/${id}`), { id });
  await createChannelChat(teamId, id, members);
};

export const updateChannel = async (teamId, channelId, updatedChannel) => {
  await update(ref(db, `teams/${teamId}/channels/${channelId}`), updatedChannel);
};

// CHANNEL CHATS

export const createChannelChat = async (teamId, channelId, users) => {
  const channelChat = {
    users,
    messages: [],
  };

  const result = await push(ref(db, `teams/${teamId}/channels/${channelId}/chat`), channelChat);
  const id = result.key;

  await update(ref(db, `teams/${teamId}/channels/${channelId}/chat/${id}`), { id });
};
