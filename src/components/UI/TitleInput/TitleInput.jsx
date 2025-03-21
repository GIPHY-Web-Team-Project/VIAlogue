import React from 'react';

export default function TitleInput() {
  return (
    <>
      <label htmlFor='title'>Title: </label>
      <input type='text' id='title' placeholder='Enter title' />
    </>
  );
}
