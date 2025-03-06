import { useState } from 'react';
import Button from '../Button/Button';

export default function SearchBar({ type, objects, objectList, setObjectList }) {
  const [selectedSearch, setSelectedSearch] = useState('username');

  const handleSearch = () => {
    if (type !== 'users') setSelectedSearch('title');
    const searchData = document.getElementById('search').value.toLowerCase();
    if (!searchData) {
      if (objectList.length !== objects.length) setObjectList(objects);
      return;
    }

    const filteredData = objects.filter((object) => object[selectedSearch]?.toLowerCase().includes(searchData));

    if (JSON.stringify(objectList) !== JSON.stringify(filteredData)) {
      setObjectList(filteredData);
    }
  };

  return (
    <div>
      <label htmlFor='search'>Find {type} </label>
      <input type='text' id='search' placeholder='Search' />
      {type === 'users' && (
        <>
          <span>by</span>
          <select onChange={(e) => setSelectedSearch(e.target.value)} className='search-select'>
            <option value='username'>username</option>
            <option value='email'>email</option>
          </select>
        </>
      )}
      {/* <FilterSelect type={type} setSelectedSearch={setSelectedSearch} /> */}
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
