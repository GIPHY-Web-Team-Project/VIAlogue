import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-900'>
      <h1 className='text-4xl font-bold mb-8'>Welcome to VIAlogue!</h1>
      <div className='space-y-4'>
        <button onClick={() => navigate('/register')} className='w-48 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
          Go to Register
        </button>
        <button onClick={() => navigate('/login')} className='w-48 bg-blue-500  px-4 py-2 rounded hover:bg-blue-600'>
          Go to Login
        </button>
      </div>
    </div>
  );
}
