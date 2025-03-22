import { useEffect, useContext } from 'react';
import { ref, onDisconnect, set, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../store/app-context';

export default function UserStatus() {
  const { userData } = useContext(AppContext);

  useEffect(() => {
    if (userData) {
      const statusRef = ref(db, 'status/' + userData.username);

      const connectedRef = ref(db, '.info/connected');
      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          set(statusRef, { status: 'online' });

          onDisconnect(statusRef).set({ status: 'offline' });
        } else {
          set(statusRef, { status: 'offline' });
        }
      });
    }
  }, [userData]);

  return null;
}