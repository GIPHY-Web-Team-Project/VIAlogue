import { MIN_NAME_LENGTH, MAX_NAME_LENGTH } from '../common/constants';

/**
 * Checks if the provided name is valid based on length and character constraints.
 *
 * @param {string} name - The name to be checked.
 * @returns {string} - Returns the name if valid, otherwise returns an error message.
 */
export const nameCheck = (name) => {
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return;
  }

  if (!/^[a-zA-Z]+$/.test(name)) {
    return;
  }

  return name;
};
