import CryptoJS from 'crypto-js';

const secretKey = 'Ezclick-2024';  // You should store this securely

// Function to convert Base64 to URL-safe Base64
const toUrlSafeBase64 = (base64) => {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Function to convert URL-safe Base64 to standard Base64
const fromUrlSafeBase64 = (urlSafeBase64) => {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
};

// Encrypt function
export const encrypt = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return toUrlSafeBase64(encryptedData);
};

// Decrypt function
export const decrypt = (ciphertext) => {
  const standardBase64 = fromUrlSafeBase64(ciphertext);
  const bytes = CryptoJS.AES.decrypt(standardBase64, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

