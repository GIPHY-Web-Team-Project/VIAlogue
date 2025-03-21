import { MIN_CHAT_TITLE_LENGTH, MAX_CHAT_TITLE_LENGTH } from '../common/constants';


/**
 * Validates the length of a chat title.
 *
 * @param {string} title - The chat title to validate.
 * @returns {string} Returns the original title if valid, otherwise an error message.
 */
export const titleCheck = (title) => {
  if (title.length < MIN_CHAT_TITLE_LENGTH || title.length > MAX_CHAT_TITLE_LENGTH) {
    return 'Invalid title. Title must be between 3 and 40 characters long.';
  }
  return title;
};
