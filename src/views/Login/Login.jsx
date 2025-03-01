import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { loginUser } from '../../services/authentication.service';
import { getUserData } from '../../services/user.service';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const login = async () => {
        if (!credentials.email || !credentials.password) {
            return alert('Please enter both email and password');
        }

        try {
            const userCredential = await loginUser(credentials.email, credentials.password);
            const firebaseUser = userCredential.user;

            const userData = await getUserData(firebaseUser.uid);
            setAppState({ user: firebaseUser, userData });

            navigate('/teams');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed: ' + error.message);
        }
    };

    const updateCredentials = (prop) => (e) => {
        setCredentials({
            ...credentials,
            [prop]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Login</h2>
                <p className="text-gray-400 text-center mb-6">Enter your credentials to log in</p>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={updateCredentials('email')}
                        className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={updateCredentials('password')}
                        className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={login}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </div>
                <p className="text-gray-400 text-center mt-6">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;