export default function TitleInput({ placeholder = 'Enter title' }) {
  return (
    <>
      <label htmlFor='title'>Title: </label>
      <input type='text' id='title' placeholder={placeholder} />
    </>
  );
}
