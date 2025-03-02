import './Header.css';

export default function Header() {
  return (
    <header className='flex items-center justify-between py-2 px-4  bg-light-blue'>
      <span className='text-6xl'>LOGO</span>
      <div className='flex gap-4 mr-8'>
        <button className='border-4 border-dark-blue rounded-lg py-1 px-2 bg-light-blue hover:bg-blue hover:border-blue cursor-pointer transition'>Log In</button>
        <button className='btn'>Sign Up</button>
      </div>
    </header>
  );
}
