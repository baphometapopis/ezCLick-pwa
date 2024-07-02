import CryptoJS from 'crypto-js';

const secretKey = 'Ezclick-2024';  // You should store this securely

// Encrypt function
export const encrypt = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  const base64EncryptedData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedData));
  return base64EncryptedData;
};

// Decrypt function
export const decrypt = (ciphertext) => {
  const parsedEncryptedData = CryptoJS.enc.Base64.parse(ciphertext).toString(CryptoJS.enc.Utf8);
  const bytes = CryptoJS.AES.decrypt(parsedEncryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
