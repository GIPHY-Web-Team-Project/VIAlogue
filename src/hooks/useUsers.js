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
export const useUsers = (userData, navigate) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!userData) {
            navigate('/login');
            return;
        }

        const fetchAllUsers = async() => {
            const unsubscribe = await getAllUsers((users) => {
            setUsers(users);
        })

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
        }

        fetchAllUsers();
    }, [userData, navigate]);

    return { users, setUsers };
}