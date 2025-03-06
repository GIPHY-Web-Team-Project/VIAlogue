import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/app-context';
import { useUsers } from '../../hooks/useUsers';
import SearchBar from '../SearchBar/SearchBar';

export default function SelectUsers({ selectedUsers, setSelectedUsers }) {
  const { userData } = useContext(AppContext);
  const { users } = useUsers(userData);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (users && userList.length !== users.length) {
      const usersWithoutLoggedIn = users.filter((user) => user.username !== userData.username);
      setUserList(usersWithoutLoggedIn);
    }
  }, [users]);

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user]);
    setUserList((prevList) => prevList.filter((u) => u.username !== user.username));
  };

  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.username !== user.username));
  };
  return (
    <>
      <SearchBar type='users' objects={users} objectList={userList} setObjectList={setUserList} />
      <br />
      <br />
      <h2 className="text-xl align-center pb-4">Selected so far:</h2>
      <ul>
        {selectedUsers.map((user) => (
          <div key={user.username}>
            <li className="flex flex-row justify-between align-center">
              <span className='flex-grow pt-2 pb-2'>
                {user.username} ({user.email})
              </span>
              <button onClick={() => handleRemove(user)} className='btn'>
                Remove
              </button>
            </li>
          </div>
        ))}
      </ul>
      <br />
      <br />
      <h2 className="text-xl align-center pb-4">Users:</h2>
      <ul>
        {userList.map((user) => (
          <div key={user.uid}>
            <li className="flex flex-row justify-between align-center">
              <span className='flex-grow pt-2 pb-2'>
                {user.username} ({user.email})
              </span>
              <button onClick={() => handleUserSelect(user)} className='btn'>
                Add
              </button>
            </li>
          </div>
        ))}
      </ul>
      <br />
      <br />
    </>
  );
}
