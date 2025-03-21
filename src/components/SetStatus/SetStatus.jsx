import { ref, set } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../store/app-context';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const statusOptions = ['online', 'busy', 'away', 'do not disturb'];

/**
 * Component for setting the user's status.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setShowDropdown - Function to toggle the visibility of the dropdown.
 * @param {string} props.status - The current status of the user.
 * @param {Function} props.setStatus - Function to update the user's status.
 *
 * @returns {JSX.Element} A dropdown menu for selecting a status.
 *
 * @example
 * <SetStatus
 *   setShowDropdown={setShowDropdown}
 *   status={currentStatus}
 *   setStatus={updateStatus}
 * />
 */
export default function SetStatus({ setShowDropdown, status, setStatus }) {
    const { userData } = useContext(AppContext);

    const handleStatusChange = (newStatus) => {
        const statusRef = ref(db, 'status/' + userData.username);
        set(statusRef, { status: newStatus });
        setStatus(newStatus);
        setShowDropdown(false);
    };

    return (

        <div className='absolute bottom-0 left-9 bg-gray-800 border rounded-lg shadow-lg mt-2'>
            <ul className='text-left'>
                {statusOptions.map((option) => (
                    <li
                        key={option}
                        className={`cursor-pointer px-4 py-2 hover:bg-gray-600 ${option === status ? 'text-gray-200' : ''}`}
                        onClick={() => handleStatusChange(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
}

SetStatus.propTypes = {
    setShowDropdown: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    setStatus: PropTypes.func.isRequired,
};
