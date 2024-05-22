import CryptoJS from 'crypto-js';

// Encrypt data before storing it in local storage with success status
export const storeDataLocalStorage = (key, data) => {
  try {
    const status = { success: true }; // Add success status
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret').toString(); // Encrypt data
    const dataWithStatus = { data: encryptedData, status }; // Combine data with status
    localStorage.setItem(key, JSON.stringify(dataWithStatus)); // Store data in local storage
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

// Decrypt data while fetching it from local storage along with success status
export const fetchDataLocalStorage = (key) => {
  try {
    const dataWithStatus = localStorage.getItem(key); // Retrieve data from local storage
    if (dataWithStatus === null) {
      return null; // Return null if data is not found
    }
    const parsedDataWithStatus = JSON.parse(dataWithStatus); // Parse data
    const decryptedData = CryptoJS.AES.decrypt(parsedDataWithStatus.data, 'secret').toString(CryptoJS.enc.Utf8); // Decrypt data
    return JSON.parse(decryptedData); // Parse and return decrypted data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
 