import {Api_Endpoints} from './ApiEndpoint';

export const fetchLoginDataByProposalNoAPi = async data => {
  console.log(data, 'getProposalDetails');

  var formdata = new FormData();
  formdata.append('proposal_no', data);

  const url = Api_Endpoints.fetchLoginDetailsByProposalNoEndpoint;

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
        const resdata = await response.json();
        return resdata;
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
