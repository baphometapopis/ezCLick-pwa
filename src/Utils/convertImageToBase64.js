export const convertImageToBase64 = async (file) => {
  console.log(file)
  try {
    // Create a FileReader object
    const reader = new FileReader();

    // Define a Promise to handle asynchronous file reading
    const fileReaderPromise = new Promise((resolve, reject) => {
      reader.onload = () => {
        // Resolve the Promise with the base64 data when reading is completed
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        // Reject the Promise if an error occurs during reading
        reject(error);
      };
    });

    // Read the file as base64 data
    reader.readAsDataURL(file);

    // Wait for the Promise to resolve and return the base64 data
    return await fileReaderPromise;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

export function extractBase64FromDataURI(dataURI) {
  // Split the data URI at the comma to separate the metadata from the base64 encoded data
  const parts = dataURI.split(',');

  // Check if the data URI is valid and has two parts (metadata and base64 encoded data)
  if (parts.length === 2 && parts[0].startsWith('data:')) {
    // Extract the base64 encoded data from the second part and return it
    return parts[1];
  } else {
    // If the data URI is invalid, return null or throw an error, depending on your preference
    return null;
    // Alternatively, you can throw an error:
    // throw new Error("Invalid data URI");
  }
}



