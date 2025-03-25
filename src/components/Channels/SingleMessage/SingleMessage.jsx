import React from 'react';
import { deleteMessage } from '../../../services/message.services';
import EditMessage from '../EditMessage/EditMessage';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import EmojiList from '../EmojiList/EmojiList';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/dateUtils';
import { getUserByUsername } from '../../../services/user.service';
import { useEffect } from 'react';

/**
 * Component representing a single message in a chat.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.msg - The message object containing details about the message.
 * @param {string} props.msg.sender - The username of the sender.
 * @param {string} props.msg.message - The text content of the message.
 * @param {string} [props.msg.gifUrl] - The URL of a GIF associated with the message (if any).
 * @param {string} props.msg.createdOn - The timestamp of when the message was created.
 * @param {Object} [props.msg.reactions] - An object containing emoji reactions and the users who reacted.
 * @param {string} props.msg.chatId - The ID of the chat the message belongs to.
 * @param {string} props.msg.id - The unique ID of the message.
 * @param {boolean} props.isFirstFromSender - Indicates if this is the first message from the sender in a sequence.
 *
 * @returns {JSX.Element} The rendered SingleMessage component.
 */
export const SingleMessage = ({ msg, isFirstFromSender }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { userData } = useContext(AppContext);
  const [showUsers, setShowUsers] = useState(false);
  const [senderImage, setSenderImage] = useState('/images/123.jpg');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSenderImage = async () => {
      const user = await getUserByUsername(msg.sender);
      if (user && user.profilePicture) {
        setSenderImage(user.profilePicture);
      }
    };

    fetchSenderImage();
  }, [msg.sender]);

  const handleEdit = () => {
    setShowEdit(true);
  };

  return (
    <div className='message' onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}>
      {showEdit ? (
        <EditMessage message={msg} onCancel={() => setShowEdit(false)} />
      ) : (
        <div className='flex-1 flex-col pr-2 '>
          <div className='flex flex-row justify-between'>
            {isFirstFromSender && (
              <div className='pt-4 flex flex-row justify-between w-full cursor-pointer' onClick={() => navigate(`/profile/${msg.sender}`)}>
                <div className='flex flex-row'>
                  <img src={senderImage} alt="Profile" className="w-5 h-5 rounded-full object-cover mr-2" />
                  <h3 className={userData.username === msg.sender ? 'text-blue' : 'text-teal-200'}>
                    <strong>{userData.username === msg.sender ? 'You' : msg.sender}</strong>
                  </h3>
                </div>
                <label className='text-gray-500 text-xs align-center ml-4'>{formatDate(msg.createdOn)}</label>
              </div>
            )}
          </div>
          <div className='flex flex-row justify-between mt-2'>
            <div>
              <span className='text-gray-200 whitespace-pre-wrap w-full overflow-hidden [overflow-wrap:anywhere]'>
                {msg.message && msg.message}
                {msg.gifUrl && <img src={msg.gifUrl} alt='GIF' className='w-40 h-auto rounded-lg' />}
              </span>
            </div>
            <div className='relative'>
              {showOptions && (
                <div className='absolute right-0 bg-gray-700 shadow-md rounded-md p-1 flex flex-row align-center'>
                  <EmojiList message={msg} />
                  {userData.username === msg.sender && (
                    <div className='flex flex-row'>
                      <button className='hover:text-gray-300 p-1 flex-row text-white' onClick={handleEdit}>
                        &#128393;
                      </button>
                      <button className='text-gray-300 hover:text-gray-500 p-1 flex-row' onClick={() => deleteMessage(msg.chatId, msg.id)}>
                        &#120299;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='relative flex flex-row justify-between mt-2'>
            {msg.reactions && Object.values(msg.reactions).some((users) => users.length > 0) && (
              <div className='flex flex-row gap-2 bg-gray-700 rounded-md pl-1 pr-1 mt-1'>
                {Object.entries(msg.reactions).map(
                  ([emoji, users]) =>
                    users.length > 0 && (
                      <div key={emoji} className='flex flex-col'>
                        <button key={emoji} className='flex flex-row items-center text-white px-1' onClick={() => setShowUsers(!showUsers)}>
                          {emoji} {users.length}
                        </button>
                        {showUsers && (
                          <div className='absolute bg-gray-800 shadow-md rounded-md p-1 mt-6'>
                            <ul key={emoji}>
                              {users.map((user) => (
                                <li key={user}>{user}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleMessage;

SingleMessage.propTypes = {
  msg: PropTypes.object.isRequired,
  isFirstFromSender: PropTypes.bool.isRequired,
};
