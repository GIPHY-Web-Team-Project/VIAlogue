import { useState } from 'react';
import Button from '../Button/Button';
import { MEMBERS, USERS } from '../../common/enums';

export default function SearchBar({ type, objects, objectList, setObjectList }) {
  const [selectedSearch, setSelectedSearch] = useState('username');

  const handleSearch = () => {
    if (type !== USERS) setSelectedSearch('title');
    const searchData = document.getElementById('search').value.toLowerCase();
    if (!searchData) {
      if (objectList.length !== objects.length) setObjectList(objects);
      return;
    }

    if (type === MEMBERS) {
      const filteredData = objects.filter((member) => member.toLowerCase().includes(searchData));
      if (JSON.stringify(objectList) !== JSON.stringify(filteredData)) {
        setObjectList(filteredData);
      }
    } else if (type === USERS) {
      const filteredData = objects.filter((user) => user[selectedSearch]?.toLowerCase().includes(searchData));

      if (JSON.stringify(objectList) !== JSON.stringify(filteredData)) {
        setObjectList(filteredData);
      }
    }
  };

  return (
    <div className='flex flex-row justify-between pb-2 mr-2'>
      <div className='flex flex-row'>
        {type === USERS && (
          <>
            <select onChange={(e) => setSelectedSearch(e.target.value)} className='search-select'>
              <option value='username'>Username: </option>
              <option value='email'>Email: </option>
            </select>
          </>
        )}
        <label htmlFor='search'> </label>
        <input className='w-full pl-1' type='text' id='search' placeholder={`Search by ${selectedSearch}`} />
      </div>
      <div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
}
