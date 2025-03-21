import { useEffect, useContext } from 'react';
import { ref, onDisconnect, set, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../store/app-context';

/**
 * UserStatus component is responsible for updating the user's online/offline status
 * in the database based on their connection state.
 *
 * This component uses the `AppContext` to access the `userData` object, which contains
 * the username of the current user. It listens to the connection state using Firebase's
 * `.info/connected` reference and updates the user's status in the database accordingly.
 *
 * - When the user is connected, their status is set to "online".
 * - When the user disconnects, their status is set to "offline" using the `onDisconnect` method.
 *
 * @component
 * @returns {null} This component does not render any UI.
 *
 * @requires useContext
 * @requires useEffect
 * @requires AppContext
 * @requires ref
 * @requires onValue
 * @requires set
 * @requires onDisconnect
 * @requires db
 */
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