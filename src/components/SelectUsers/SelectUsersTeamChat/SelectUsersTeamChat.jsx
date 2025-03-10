import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import { useUsers } from '../../../hooks/useUsers';
import SearchBar from '../../SearchBar/SearchBar';
import Button from '../../Button/Button';

export default function SelectUsersTeamChat({ selectedUsers, setSelectedUsers }) {
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
    <div className='flex flex-row justify-between'>
      <div className='flex flex-col w-full h-full'>
        <SearchBar type='users' objects={users} objectList={userList} setObjectList={setUserList} />
        <ul>
          <div className='flex flex-col justify-between h-full p-2 border-t-gray-600 border-t-2'>
            {userList.map((user) => (
              <div key={user.uid}>
                <li className='flex flex-row justify-between align-center pb-2'>
                  <span className='flex-grow pt-2 pb-2'>
                    {user.username} ({user.email})
                  </span>
                  <Button onClick={() => handleUserSelect(user)}>Select</Button>
                </li>
              </div>
            ))}
          </div>
        </ul>
      </div>
      <div className='flex flex-col ml-8 w-full h-full'>
        <h2 className='text-xl pb-5 border-b-gray-600 border-b-2'>Selected so far:</h2>
        <ul>
          <div className='p-2'>
            {selectedUsers.map((user) => (
              <div key={user.username}>
                <li className='flex flex-row justify-between align-center pb-2'>
                  <span className='flex-grow pt-2 pb-2'>
                    {user.username} ({user.email})
                  </span>
                  <Button onClick={() => handleRemove(user)}>Remove</Button>
                </li>
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}
