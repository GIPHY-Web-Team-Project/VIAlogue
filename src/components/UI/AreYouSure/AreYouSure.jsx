import Button from '../Button/Button';

export default function AreYouSure({ setShowSure, message, fn }) {
  const handleYes = () => {
    fn();
    setShowSure(false);
  };

  const handleNo = () => {
    setShowSure(false);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative flex flex-col'>
        <h3>{message}</h3>
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={handleNo}>No</Button>
      </div>
    </div>
  );
}
