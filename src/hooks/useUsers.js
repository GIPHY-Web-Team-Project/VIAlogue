import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/user.service';

/**
 * Custom hook to fetch and manage users.
 *
 * @param {Object} userData - The user data object.
 * @param {Function} navigate - The navigate function from react-router-dom.
 * @returns {Object} An object containing users, setUsers, originalUsers, and setOriginalUsers.
 *
 */
export const useUsers = (userData) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchAllUsers = async () => {
      unsubscribe = await getAllUsers((fetchedUsers) => {
        setUsers(fetchedUsers || []); // ✅ Ensure users is never undefined
      });
    };

    fetchAllUsers();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userData]);

  return { users: users || [] };
};
