import { useState } from 'react';
import { useNavigate } from 'react-router';

// get all users, map users and create an <option> element for every user, inside of a <select> element
// create a function that adds a user to the team when the user is selected. This is done by appending a user to the team.members array
// create a function that removes a user from the team when the user is deselected. This is done by filtering the team.members array
// create a function that creates a team when the create button is clicked. This is done by sending a POST request to the server with the team object
//

export default function CreateTeam() {
  const [team, setTeam] = useState({
    name: '',
    members: [],
  });

  const navigate = useNavigate();

  const handleUpdateValue = (key, value) => {};

  const handleCreateTeam = () => {};

  return (
    <div>
      <h3>Create Team</h3>
      <label htmlFor='title'>Title: </label>
      <input value={team.name} onChange={(e) => handleUpdateValue('title', e.target.value)} type='text' name='title' id='create-title-input' />
      <br /> <br />
      <label htmlFor='content'>Members: </label>
      <textarea value={team.members} onChange={(e) => handleUpdateValue('content', e.target.value)} name='content' id='create-content-textarea' cols='30' rows='10'></textarea>
      <br /> <br />
      <div className=''>
        <button
          className='btn'
          onClick={() => {
            handleCreateTeam();
            navigate(`/`);
          }}
        >
          Create Post
        </button>
        <BackBtn />
      </div>
    </div>
  );
}
