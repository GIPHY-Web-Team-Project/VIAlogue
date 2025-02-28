import Header from '../../components/Header/Header';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className='LandingPage'>
      <section className='LandingPage-welcome'>
        <h1>Communication is key - start chatting now!</h1>
      </section>
      <section className='LandingPage-stats'>
        <h1>Looking for a community, group or team?</h1>
        <div className='users-teams-stats'>
          <p>Users</p>
          <span>numOfUsers</span>
          <p>Teams</p>
          <span>numOfTeams</span>
        </div>
        <button>Join now!</button>
      </section>
    </div>
  );
}
