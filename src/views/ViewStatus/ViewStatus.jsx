import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';

export default function ViewStatus({ username }) {
    const [status, setStatus] = useState('offline');
  
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
        <span className={`font-bold ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>{status}</span>
      </div>
    );
  }