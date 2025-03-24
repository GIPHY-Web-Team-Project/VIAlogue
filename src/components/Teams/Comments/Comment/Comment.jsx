import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../../store/app-context';
import { getUserByUsername } from '../../../../services/user.service';

export default function Comment({ comment }) {
  const { userData } = useContext(AppContext);
  const [avatarSrc, setAvatarSrc] = useState(null);

  //   const [isEditing, setIsEditing] = useState(false);
  //   const [editedComment, setEditedComment] = useState({
  //     content: comment.content,
  //   });

  // get user avatar
  useEffect(() => {
    if (!userData) return;

    if (userData.username === comment.author) {
      setAvatarSrc(userData.profilePicture);
    } else {
      const fn = async () => {
        const uploader = await getUserByUsername(comment.author);
        setAvatarSrc(uploader.profilePicture);
      };

      fn();
    }
  }, []);

  console.log(userData.username, comment.author);

  return (
    <>
      <p className='break-words whitespace-normal max-w-3xl'>{comment.content}</p>
      <div className='flex items-center'>
        <img className='mr-2 h-10 w-10 rounded-full overflow-hidden bg-gray-100' src={avatarSrc || '/images/123.jpg'} alt={comment.author} />
        {comment.author}
      </div>
    </>
  );
}
