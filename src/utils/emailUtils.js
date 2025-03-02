/**
 * Encodes an email address by replacing all periods (.) with commas (,).
 *
 * @param {string} email - The email address to encode.
 * @returns {string} The encoded email address.
 */
export const encodeEmail = (email) => {
  return email.replace(/\./g, ',');
};

/**
 * Decodes an encoded email address by replacing commas with periods.
 *
 * @param {string} encodedEmail - The encoded email address.
 * @returns {string} - The decoded email address.
 */
export const decodeEmail = (encodedEmail) => {
  return encodedEmail.replace(/,/g, '.');
};
