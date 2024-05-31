import { Api_Endpoints } from "./ApiEndpoint";

export const getOTP = async (data) => {

    
   
    var formdata = new FormData();
    formdata.append('break_in_case_id', data?.break_in_case_id);
    formdata.append('proposal_id', data?.proposal_id);
    formdata.append('email_id', data?.email_id);

  
    const url = Api_Endpoints.sendOTP;
  
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
  

  export const verifyOTP = async (data) => {

    
   
    var formdata = new FormData();
    formdata.append('email_id', data?.email_id);
    formdata.append('proposal_id', data?.proposal_id);
    formdata.append('otp', data?.otp);

  
    const url = Api_Endpoints.VerifyOTP;
  
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
  