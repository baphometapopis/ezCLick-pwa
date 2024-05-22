import {Api_Endpoints} from './ApiEndpoint';

export const fetch_Image_inspection_question = async data => {
  const url = Api_Endpoints.fetch_Image_inspection_question_Endpoint;

  try {
    const response = await fetch(url, {
      method: 'GET',
      //   body: formdata, // Use the FormData object directly
    });
    if (!response.ok) {
      console.log(`API Error - HTTP Status: ${response.status}`);

      const contentType = response.headers.get('Content-Type');
      console.error('Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const jsondata = await response.json();
        return jsondata;
      } else {
        const text = await response.text();
        console.log('Non-JSON Response:', text);
      }

      return response.status;
    }
    const datas = await response.json();

    return datas;
  } catch (error) {
    throw new Error(`API Error - ${error}`);
  }
};

export const fetch_Checkpoint_inspection_question = async data => {
  const url = Api_Endpoints.fetch_Checkpoint_inspection_question_Endpoint;

  try {
    const response = await fetch(url, {
      method: 'POST',
      //   body: formdata, // Use the FormData object directly
    });
    if (!response.ok) {
      console.log(`API Error - HTTP Status: ${response.status}`);

      const contentType = response.headers.get('Content-Type');
      console.error('Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('API Response Data:', data);
      } else {
        const text = await response.text();
        console.log('Non-JSON Response:', text);
      }

      return response.status;
    }
    const datas = await response.json();

    return datas;
  } catch (error) {
    throw new Error(`API Error - ${error}`);
  }
};


