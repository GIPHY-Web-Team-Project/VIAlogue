import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import Button from '../../UI/Button/Button';
import SearchBar from '../../UI/SearchBar/SearchBar';
import { MEMBERS } from '../../../common/enums';
import React from 'react';
import PropTypes from 'prop-types';

export default function SelectUsersChannel({ selectedUsers, setSelectedUsers, teamMembers }) {
  const { userData } = useContext(AppContext);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (teamMembers && userList.length !== teamMembers.length) {
      const usersWithoutLoggedIn = teamMembers.filter((user) => user !== userData.username);
      setUserList(usersWithoutLoggedIn);
    }
  }, [teamMembers]);

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user]);

    setUserList((prevList) =>
      prevList.filter((u) => {
        return u !== user;
      })
    );
  };

  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
  };

  console.log(selectedUsers);
  console.log(userList);

  return (
    <div className='flex flex-row justify-between'>
      <div className='flex flex-col w-full h-full'>
        <SearchBar type={MEMBERS} objects={teamMembers.filter((user) => user !== userData.username)} objectList={userList} setObjectList={setUserList} />
        <ul>
          <div className='flex flex-col justify-between h-full p-2 border-t-gray-600 border-t-2'>
            {userList.map((user) => (
              <div key={user}>
                <li className='flex flex-row justify-between align-center pb-2'>
                  <span className='flex-grow pt-2 pb-2'>{user}</span>
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
              <div key={user}>
                <li className='flex flex-row justify-between align-center pb-2'>
                  <span className='flex-grow pt-2 pb-2'>{user}</span>
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

SelectUsersChannel.propTypes = {
  selectedUsers: PropTypes.array,
  setSelectedUsers: PropTypes.func,
  teamMembers: PropTypes.array,
};
