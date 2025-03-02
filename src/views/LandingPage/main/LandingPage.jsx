export default function LandingPage() {
  return (
    <div className='flex flex-col flex-grow'>
      <section className='flex justify-between pl-16 w-full mt-30'>
        <h1 className='text-6xl font-bold'>Communication is key - start chatting now!</h1>
        <div className='flex flex-col items-center mt-40 mr-60'>
          <button className='m-1 text-2xl p-6 bg-dark-blue rounded-lg hover:bg-blue hover:text-black text-white hover:cursor-pointer transition'>Get Started</button>
          <button className='m-1 hover:cursor-pointer hover:font-bold'>Learn more</button>
        </div>
      </section>

      <section className='flex flex-col items-center gap-5 border mx-auto mt-auto w-content p-4'>
        <h1>Looking for a community, group or team?</h1>
        <div className='grid grid-cols-2 grid-rows-2 gap-4 justify-items-center'>
          <p>Users</p>
          <p>Teams</p>
          <span>numOfUsers</span>
          <span>numOfTeams</span>
        </div>
        <button className='p-10 btn'>Join now!</button>
      </section>
    </div>
  );
}
