import CryptoJS from 'crypto-js';

const secretKey = 'Ezclick-2024';  // You should store this securely

// Escape special characters
const escapeString = (str) => {
  return str.replace(/\\/g, '\\\\').replace(/\//g, '\\/');
};

// Unescape special characters
const unescapeString = (str) => {
  return str.replace(/\\\//g, '/').replace(/\\\\/g, '\\');
};

// Encrypt function
export const encrypt = (data) => {
  const escapedData = escapeString(data);
  return CryptoJS.AES.encrypt(escapedData, secretKey).toString();
};

// Decrypt function
export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return unescapeString(decryptedData);
};
