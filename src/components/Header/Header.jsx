import '../../styles.css';

export default function Header() {
  return (
    <header className='flex'>
      <span>LOGO</span>
      <div className='header-btns'>
        <button>Sign Up</button>
        <button>Log In</button>
      </div>
    </header>
  );
}
