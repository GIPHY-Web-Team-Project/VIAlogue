import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { registerUser } from "../../services/authentication.service";
import { createUserHandle, getUserByUsername } from "../../services/user.service";
import { PasswordInput, PasswordStrengthMeter } from "../../components/PasswordInput";
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "../../utils/constants";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const register = async () => {
        if (!user.username || !user.email || !user.password) {
            return alert("Please fill out all fields");
        }

        if (user.username.length < USERNAME_MIN_LENGTH || user.username.length > USERNAME_MAX_LENGTH) {
            return alert(`Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`);
        }

        try {
            const userFromDB = await getUserByUsername(user.username);
            if (userFromDB) {
                throw new Error(`User ${user.username} already exists`);
            }

            const credential = await registerUser(
                user.email,
                user.password,
                user.username
            );
            await createUserHandle(user.username, credential.user.uid, user.email);

            setAppState({
                user: credential.user,
                userData: null,
            });

            navigate("/login");
        } catch (error) {
            console.error("Register failed", error);
            alert("Registration failed: " + error.message);
        }
    };

    const updateUser = (prop) => (e) => {
        const value = e.target.value;
        setUser({
            ...user,
            [prop]: value,
        });

        if (prop === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Register</h2>
                <p className="text-gray-400 text-center mb-6">Fill in the form below to create an account</p>
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400">Username <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={user.username}
                            onChange={updateUser("username")}
                            className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={updateUser("email")}
                            className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400">Password <span className="text-red-500">*</span></label>
                        <PasswordInput
                            value={user.password}
                            onChange={updateUser("password")}
                            className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <PasswordStrengthMeter value={passwordStrength} />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={register}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </div>
                <p className="text-gray-400 text-center mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;