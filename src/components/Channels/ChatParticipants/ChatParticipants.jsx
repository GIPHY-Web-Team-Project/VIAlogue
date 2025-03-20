import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { getUserByUsername } from '../../../services/user.service';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import { CHAT_PARTICIPANTS_BTNS } from '../../../common/enums';
import { useUsers } from '../../../hooks/useUsers';
import { updateChat } from '../../../services/chat.services';
import SelectUsersTeamChat from '../../SelectUsers/SelectUsersTeamChat/SelectUsersTeamChat';
export const ChatParticipants = ({ participants, handleLeaveChat, selectedUser, setSelectedUser, chatId }) => {
    const { userData } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [showLeave, setShowLeave] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSelectUsers, setShowSelectUsers] = useState(false);
    const [usersNotInChat, setUsersNotInChat] = useState([]);
    const { users: allUsers } = useUsers(userData); 
    const [ selectedUsers, setSelectedUsers ] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await Promise.all(
        participants.map(async (username) => {
          return await getUserByUsername(username);
        })
      );
      setUsers(userList);
    };

        fetchUsers();

        const fetchUsersNotInChat = () => {
            if (allUsers && userData) {
                const availableUsers = allUsers
                    .filter((user) => user.username !== userData.username)
                    .filter((user) => !participants.includes(user.username));
                setUsersNotInChat(availableUsers);
            }
        };

        fetchUsersNotInChat();
    }, [participants, userData, allUsers]);

  const handleProfileView = (user) => {
    navigate(`/profile/${user.username}`);
  };

  const handleUserClick = (user) => {
    if (user === userData.username) {
      setShowLeave(!showLeave);
      setShowProfile(false);
    } else {
      setSelectedUser(user);
      setShowProfile(!showProfile);
      setShowLeave(false);
    }
  };

    const toggleSelectUsers = () => {
        setShowSelectUsers(!showSelectUsers);
        if(usersNotInChat.length === 0) {
            const userList = users.filter((user) => user.username !== userData.username && !participants.includes(user.username));
            setUsersNotInChat(userList);
        }
    }

    const handleNewUsers = async () => {
        const newUsers = selectedUsers.map((user) => user);
        try {
            await updateChat(chatId, [...participants, ...newUsers], "users");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="absolute top-12 right-5 bg-gray-800 text-white z-50 shadow-lg overflow-y-auto border border-gray-600">
            <ul>
                {users.map((user) => (
                    <li key={user.uid || user.username} className="p-2 hover:bg-gray-700 cursor-pointer">
                        <div className="flex flex-row">
                            <span>
                                <img className="mr-2 h-5 w-5 rounded-full overflow-hidden bg-gray-100" src={user.profilePicture || '/images/123.jpg'} alt={user.username} />
                            </span>
                            <span onClick={() => handleUserClick(user.username)} className="mr-2">{user.username}</span>
                            {(userData.username === user.username) && showLeave && (
                                <Button btnStyle={CHAT_PARTICIPANTS_BTNS} onClick={handleLeaveChat}>
                                    Leave
                                </Button>
                            )}
                            {(selectedUser === user.username) && (selectedUser !== userData.username) && showProfile && (
                                <>
                                    <Button btnStyle={CHAT_PARTICIPANTS_BTNS} onClick={() => handleProfileView(user)}>
                                        View profile
                                    </Button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <button className="text-s flex flex-wrap place-content-center p-2 cursor-pointer border-t-2 border-gray-700 w-full" onClick={toggleSelectUsers}>Add people &nbsp; <img src="/images/add-people.png" className="h-5 w-5 flex justify-self-center align-center"/></button>
            { showSelectUsers && (
                <div className="mt-4">
                    <SelectUsersTeamChat selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} userList={usersNotInChat} setUserList={setUsersNotInChat}/>
                    <button 
                        onClick={handleNewUsers} 
                        className="mt-2 w-full mb-2 border-t-2 border-gray-700 p-2"
                    >
                    Add to chat
                    </button>   
                </div>
            )}
        </div>
    )
}

export default ChatParticipants;
