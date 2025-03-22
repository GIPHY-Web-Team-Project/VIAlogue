import { useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';
import SetStatus from '../../components/SetStatus/SetStatus';
import { AppContext } from '../../store/app-context';

export default function ViewStatus({ username, type = 'user' }) {
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
        <div className='text-gray-400 text-center mt-2'>
            
                
            <div
                className='relative inline-block text-center mt-2'
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
            >
                <span className={`font-bold ${status === 'online' ? 'text-green-500' : status === 'busy' ? 'text-yellow-500' : status === 'away' ? 'text-orange-500' : 'text-red-500'}`}>
                    {status}
                </span>
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