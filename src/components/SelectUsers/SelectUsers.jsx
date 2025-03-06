import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/app-context';
import { useUsers } from '../../hooks/useUsers';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../Button/Button';

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
      <h3>Selected users</h3>
      <ul>
        {selectedUsers.map((user) => (
          <div key={user.username}>
            <li>
              <span>
                {user.username} ({user.email})
              </span>
              <Button onClick={() => handleRemove(user)}>Remove</Button>
            </li>
          </div>
        ))}
      </ul>
      <br />
      <br />
      <h3>Users to choose from:</h3>
      <ul>
        {userList.map((user) => (
          <div key={user.uid}>
            <li>
              <span>
                {user.username} ({user.email})
              </span>
              <Button onClick={() => handleUserSelect(user)}>Select</Button>
            </li>
          </div>
        ))}
      </ul>
      <br />
      <br />
    </>
  );
}
