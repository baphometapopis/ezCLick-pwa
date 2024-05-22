import {Api_Endpoints} from './ApiEndpoint';

export const submit_odometer_Reading = async (data) => {
  var formdata = new FormData();

  formdata.append('odometer', data?.odometer);
  formdata.append('user_id',data?.user_id );
  formdata.append('break_in_case_id', data?.break_in_case_id);


  // formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.submit_odometer_reading_Endpoint;
  // console.log(formdata);

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
        return jsondata;
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
