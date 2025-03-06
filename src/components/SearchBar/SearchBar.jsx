import { useState } from 'react';

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
      {type === 'users' && (
        <>
          <select onChange={(e) => setSelectedSearch(e.target.value)} className='search-select'>
            <option value='username'>Username: </option>
            <option value='email'>Email: </option>
          </select>
        </>
      )}
      <label htmlFor='search'> </label>
      <input type='text' id='search' placeholder={`Enter ${selectedSearch}`} />
      {/* <FilterSelect type={type} setSelectedSearch={setSelectedSearch} /> */}
      <button onClick={handleSearch} className='mt-4 w-full btn'>
        Search
      </button>
    </div>
  );
}
