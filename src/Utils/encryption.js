import CryptoJS from 'crypto-js';

const secretKey = 'Ezclick-2024';  // You should store this securely

// Encrypt function
export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Decrypt function
export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
