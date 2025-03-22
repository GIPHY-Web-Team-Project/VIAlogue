import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import SetStatus from '../../components/SetStatus/SetStatus';
import { AppContext } from '../../store/app-context';
import PropTypes from 'prop-types';

/**
 * ViewStatus Component
 *
 * This component displays the online status of a user and allows the user to change their status
 * if they are the logged-in user. The status is fetched from a database and updated in real-time.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.username - The username of the user whose status is being displayed.
 * @param {string} [props.type='user'] - The type of the entity (default is 'user').
 *
 * @returns {JSX.Element} A React component that displays the user's status and a dropdown for changing it.
 *
 * @example
 * <ViewStatus username="john_doe" type="user" />
 *
 * @dependencies
 * - useContext from React: To access the global application context.
 * - useState from React: To manage the component's local state.
 * - useEffect from React: To handle side effects like subscribing to database changes.
 * - AppContext: The global application context for accessing user data.
 * - ref and onValue from Firebase: To interact with the Firebase Realtime Database.
 * - SetStatus: A child component for changing the user's status.
 */
export default function ViewStatus({ username, type = 'user', source = 'profile' }) {
    const { userData } = useContext(AppContext);
    const [status, setStatus] = useState('offline');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const statusRef = ref(db, 'status/' + username);

        const unsubscribe = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            setStatus(data?.status || 'offline');
        });

        return () => {
            unsubscribe();
        };
    }, [username]);

    return (
        <div className='text-gray-400'>
            <div
                className='relative inline-block text-center mt-2'
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
            >
                <div className='flex flex-row'>
                    <img src={`/images/${status}.png`} alt={`${status} icon`} className={(source === 'profile' && `h-6 w-6`) || (source === 'chat-participants' && `h-4 w-4 content-center mr-2`) || (source === 'profile-details' && 'h-10 w-10')}/>
                    {source==='profile-details' && <span className='content-center ml-2' style={{ textTransform: 'capitalize' }}>{status}</span>}
                </div>
                {userData.username === username && type === 'user' && (
                    <div>
                {showDropdown && (
                    <SetStatus setShowDropdown={setShowDropdown} status={status} setStatus={setStatus} />
                )}
                </div>
                )}
            </div>
        </div>
    );
}

ViewStatus.propTypes = {
    username: PropTypes.string.isRequired,
    type: PropTypes.string,
};
