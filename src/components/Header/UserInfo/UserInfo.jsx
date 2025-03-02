import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import defaultProfilePicture from "../../../assets/default-profile-picture.jpg";

export default function UserInfo() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate("/profile");
    };

    return (
        <div className="fixed bottom-7 right-6 w-64 h-24 p-2 bg-gray-800 rounded-md shadow-lg flex items-center">
            <div className="flex items-center space-x-3">
                {/* User's Profile Picture */}
                <img
                    className="w-10 h-10 rounded-full"
                    src={userData?.photoURL || defaultProfilePicture}
                    alt="User Profile"
                />
                {/* User's Username */}
                <div className="text-white">
                    <p className="text-lg font-bold">{userData?.username || "Loading..."}</p>
                    <p className="text-xs">Created: {userData?.createdOn.slice(0, 10)}</p>
                </div>
                {/* Settings Icon */}
                <div
                    className="flex items-center space-x-1 cursor-pointer text-white"
                    onClick={handleSettingsClick}
                >
                    <span role="img" aria-label="settings">
                        ⚙️
                    </span>
                    <p className="text-sm">Settings</p>
                </div>
            </div>
        </div>
    );
}