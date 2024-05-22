import {Api_Endpoints} from './ApiEndpoint';

export const submit_inspection_checkpointData = async data => {
  console.log(data, 'dsdsd');
  var formdata = new FormData();

  formdata.append('user_id', data?.user_id );
  formdata.append('proposal_list_id', data?.proposal_list_id );
  formdata.append('question_answer_ids', data?.question_answer_ids);
  formdata.append('product_type_id', data?.product_type_id );
  formdata.append('breakin_steps', data?.breakin_steps );

  const url = Api_Endpoints.submit_inspection_checkpoint;
  

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

export const submit_inspection_Images = async (data, param) => {
  console.log(data, param);
  var formdata = new FormData();

  formdata.append('user_id', data?.user_id);
  formdata.append('break_in_case_id', data?.break_in_case_id);
  formdata.append('question_id', data?.question_id);
  formdata.append('proposal_id', data?.proposal_id);
  formdata.append('image', data?.image);
  formdata.append('breakin_steps', data?.breakin_steps);

  // formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.submit_inspection_images_new;

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

export const submit_inspection_Video = async (data) => {
  console.log(data)
  var formdata = new FormData();

  formdata.append('user_id', data?.user_id);
  formdata.append('break_in_case_id', data?.break_in_case_id);
  formdata.append('proposal_id', data?.proposal_id);
  formdata.append('video',data?.video);
  formdata.append('breakin_steps', data?.breakin_steps);


  // formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.submit_inspection_Video_Endpoint;
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


export const updateProposalSteps = async (data) => {
  console.log(data)
  var formdata = new FormData();

  
  formdata.append('user_id', data?.user_id);
  formdata.append('breakin_steps', data?.breakin_steps);
  formdata.append('proposal_id', data?.proposal_id);



  // formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.update_Proposal_Steps;
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