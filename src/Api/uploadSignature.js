import { Api_Endpoints } from "./ApiEndpoint";

export const uploadSignature = async (id, image) => {
    const imageData = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    var formdata = new FormData();
    formdata.append('proposal_id', id);
    formdata.append('image', imageData);
  
    const url = Api_Endpoints.upload_signature_endpoint;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formdata, // Use the FormData object directly
      });
      if (!response.ok) {
        console.log(`API Error - HTTP Status: ${response.status}`);
  
        const contentType = response.headers.get('Content-Type');
        console.error('Content-Type:', contentType);
  
        if (contentType && contentType.includes('application/json')) {
          const jsondata = await response.json();
          return jsondata
          } else {
          const text = await response.text();
          console.log('Non-JSON Response:', text);
        }
  
        return response.status;
      }
      const datas = await response.json();
      console.log(datas);
  
      return datas;
    } catch (error) {
      throw new Error(`API Error - ${error}`);
    }
  };
  