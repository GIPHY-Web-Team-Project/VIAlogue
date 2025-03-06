import { MIN_CHAT_TITLE_LENGTH, MAX_CHAT_TITLE_LENGTH } from '../common/constants';

/**
 * Checks if the provided name is valid based on length and character constraints.
 *
 * @param {string} title - The title to be checked.
 * @returns {string} - Returns the title if valid, otherwise returns an error message.
 */
export const titleCheck = (title) => {
  if (title.length < MIN_CHAT_TITLE_LENGTH || title.length > MAX_CHAT_TITLE_LENGTH) {
    return 'Invalid title. Title must be between 3 and 40 characters long.';
  }
  return title;
};
