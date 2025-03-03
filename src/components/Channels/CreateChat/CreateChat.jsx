import React, { use, useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { ChatContext } from '../../../store/chat.context';
import { createChat } from '../../../services/chat.services';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../hooks/useUsers';
import Modal from '../../Modal/Modal';
import { useEffect } from 'react';

export const CreateChat = () => {
    const { userData } = useContext(AppContext);
    const { setSelectedChat } = useContext(ChatContext);
    const [selectedUsers, setSelectedUsers] = useState([userData]);
    const [selectedSearch, setSelectedSearch] = useState('username');
    const navigate = useNavigate();
    const { users } = useUsers(userData, navigate);
    const [userList, setUserList] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (users) {
            const usersWithoutLoggedIn = users.filter(user => user.username !== userData.username);
            setUserList(usersWithoutLoggedIn);
        }
    }, [users]);

    const handleUserSelect = (user) => {
        setSelectedUsers([...selectedUsers, user]);
        setUserList(userList.filter(u => u.username !== user.username));
    };

    const handleCreateChat = async () => {
        const selected = selectedUsers.map(user => user);
        const chatUsers = [...selected, userData];

        if (chatUsers.length < 2) {
            setModalMessage('Please select at least 2 users to create a chat');
            setShowModal(true);
            return;
        }

        const chatTitle = document.getElementById('title').value.toLowerCase();

        try {
            await createChat(chatUsers, chatTitle, (chatId) => {
                setSelectedChat({id: chatId, chatUsers});
                navigate(`users/${userData.username}/chats/${chatId}`);
            })
        } catch {
            console.log('Error creating chat');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleRemove = (user) => {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.username !== user.username));
    }

    const handleSearch = () => {
        const searchData = document.getElementById('search').value.toLowerCase();
        if (!searchData) {
            setUserList(users);
            return;
        }

        const filteredData = users.filter(user => {
            if (selectedSearch === 'username' || selectedSearch === 'email') {
                return user[selectedSearch].toLowerCase().includes(searchData);
            }
        });
        setUserList(filteredData);
    }

    return (
        <div>
            <h2>Start a new chat</h2>
            <label htmlFor='title'>Title </label>
            <input type='text' id="title" placeholder='Enter title'/><br/><br/>
            <label htmlFor='search'>Find users </label>
            <input type='text' id="search" placeholder='Search'/>
             <span>by</span>
            <select onChange={(e) => setSelectedSearch(e.target.value)} className="search-select">
                <option value='username'>username</option>
                <option value='email'>email</option>
            </select>
            <button onClick={handleSearch}>Search</button>
            <br/><br/>
            <h3>Selected users</h3>
            <ul>
                {selectedUsers.map(user => (
                    <div key={user.username}>
                        <li>
                            <span>{user.username} ({user.email})</span>
                            <button onClick={() => handleRemove(user)}>Remove</button>
                        </li>
                    </div>
                ))}
            </ul>
            <br/><br/>
            <h3>Users to choose from:</h3>
            <ul>
                {userList.map(user => (
                    <div key={user.uid}>
                        <li>
                            <span>{user.username} ({user.email})</span>
                            <button onClick={(userObj) => handleUserSelect(userObj)}>Select</button>
                        </li>
                    </div>
                ))}
            </ul>
            <br/><br/><br/>
            <button onClick={handleCreateChat}>Create Chat</button>
            <Modal message={modalMessage} show={showModal} handleClose={handleCloseModal}/>
        </div> 
    )
}

export default CreateChat;