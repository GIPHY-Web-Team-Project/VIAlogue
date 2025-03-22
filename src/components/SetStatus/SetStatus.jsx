import { ref, set } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../store/app-context';
import { useContext } from 'react';

const statusOptions = ['online', 'busy', 'away', 'do not disturb'];

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