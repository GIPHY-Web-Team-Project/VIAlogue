export default function CommPostBtns({ showBtns, setIsEditing, handleDelete, objId }) {
  return (
    <div className='self-end'>
      {showBtns && (
        <>
          <span className='text-2xl hover:cursor-pointer hover:ring rounded-md' onClick={() => setIsEditing(true)}>
            ✏
          </span>
          <span className='text-2xl hover:cursor-pointer hover:ring rounded-md' onClick={() => handleDelete(objId)}>
            ❌
          </span>
        </>
      )}
    </div>
  );
}
