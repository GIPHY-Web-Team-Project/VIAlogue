import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import { useUsers } from '../../../hooks/useUsers';
import SearchBar from '../../UI/SearchBar/SearchBar';
import Button from '../../UI/Button/Button';

export default function SelectUsersTeamChat({ selectedUsers, setSelectedUsers, userList, setUserList }) {
  const { userData } = useContext(AppContext);
  const { users } = useUsers(userData);

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user.username]);
    setUserList((prevList) => prevList.filter((u) => u.username !== user.username));
  };

  const handleRemove = (user) => {
    const userObj = users.find((u) => u.username === user);
    if (userObj) {
      setUserList((prevList) => [...prevList, userObj]);
    }
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
  };

  return (
    <div className='flex flex-row justify-between'>
      <div className='flex flex-col w-full h-full'>
        <SearchBar type='users' objects={users} objectList={userList} setObjectList={setUserList} selectedUsers={selectedUsers} />
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
            {selectedUsers.map((username) => (
              <div key={username}>
                <li className='flex flex-row justify-between align-center pb-2'>
                  <span className='flex-grow pt-2 pb-2'>{username}</span>
                  <Button onClick={() => handleRemove(username)}>Remove</Button>
                </li>
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}
