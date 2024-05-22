import { Api_Endpoints } from "./ApiEndpoint";

export const fetchNewInspection = async (data) => {
  console.log(data, "getProposalDetails");

  var formdata = new FormData();
  formdata.append("user_id", data?.id);
  formdata.append("is_data", "1");

  formdata.append("business_id", data?.business_id);

  const url = Api_Endpoints.fetchPendingInspectionEndpoint;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formdata, // Use the FormData object directly
    });
    if (!response.ok) {
      console.log(`API Error - HTTP Status: ${response.status}`);

      const contentType = response.headers.get("Content-Type");
      console.error("Content-Type:", contentType);

      if (contentType && contentType.includes("application/json")) {
        const resdata = await response.json();
        return resdata;
      } else {
        const text = await response.text();
        console.log("Non-JSON Response:", text);
      }
      return response.status;
    }
    const datas = await response.json();
    console.log(response);

    return datas;
  } catch (error) {
    throw new Error(`API Error - ${error}`);
  }
};
