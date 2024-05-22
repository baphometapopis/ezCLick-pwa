import { Api_Endpoints } from "./ApiEndpoint";

export const fetchProposalDetails = async (data) => {
  var formdata = new FormData();
  formdata.append("proposal_no", data);

  const url = Api_Endpoints.fetchProposalDetailsEndpoint;

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
        const data = await response.json();
        console.log("API Response Data:", data);
      } else {
        const text = await response.text();
        console.log("Non-JSON Response:", text);
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
