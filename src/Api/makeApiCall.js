import { fetchDataLocalStorage } from "../Utils/LocalStorage";

const user_data = fetchDataLocalStorage('Claim_proposalDetails');
const DEFAULT_BODY_PARAMS = {
  user_id: user_data?.data?.user_id,
  break_in_case_id: user_data?.data?.breakin_inspection_id,
  proposal_no: user_data?.data?.proposal_no,
  proposal_id: user_data?.data?.id,
  product_type_id:user_data?.data?.v_product_type_id
};

const serializeToQueryParams = (obj) => {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      let encodedValue = encodeURIComponent(obj[p]);
      // Replace any encoded "/" (%2F) with "/"
      encodedValue = encodedValue.replace(/%2F/g, "/");
      str.push(encodeURIComponent(p) + "=" + encodedValue);
    }
  }
  return str.join("&");
};

// Function to make API calls with fetch
export const makeApiCall = async (url, method, data = {}) => {
  const requestOptions = {
    method,
    headers: {
      // 'Content-Type': 'application/json', // Remove this for FormData
      // Add authorization token to the request headers if needed
      // 'auth': `${AUTH_TOKEN}`,
    },
  };

  if (method === 'GET') {
    const queryParams = serializeToQueryParams({ ...DEFAULT_BODY_PARAMS, ...data });
    url += `?${queryParams}`;
  } else {
    // Create a FormData object for POST requests
    const formData = new FormData();
    const bodyParams = { ...DEFAULT_BODY_PARAMS, ...data };
    for (const key in bodyParams) {
      if (bodyParams.hasOwnProperty(key)) {
        formData.append(key, bodyParams[key]);
      }
    }
    requestOptions.body = formData;
  }

  try {
    const response = await fetch(`${url}`, requestOptions);
    return await response.json();
  } catch (error) {
    console.log(`API call failed for ${url}: ${error.message}`);
  }
};
