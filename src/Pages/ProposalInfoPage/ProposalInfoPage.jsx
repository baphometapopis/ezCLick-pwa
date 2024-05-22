import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import { isInspectionImagesFolderEmpty } from "../Utils/checkLocalStoragefordata";
import "./ProposalInfoPage.css"; // Import CSS module
import { CallIcon, CarIcon, CustomerCare, IconClose, StartInspection, WhatsappIcon } from "../../Constant/ImageConstant";
import { fetchProposalDetails } from "../../Api/fetchProposalDetails";
import { url } from "../../Api/ApiEndpoint";
import { fetchLoginDataByProposalNoAPi } from "../../Api/fetchLoginDetailsByProposalNo";
import {  storeDataLocalStorage } from "../../Utils/LocalStorage";
import Header from "../../Component/Header";

export const ProposalInfoPage = ({ route }) => {
  
  const { proposalNumber } = useParams(); //extract proposal number

  // const [isLoading, setLoading] = useState(false);
  const [isProposalexist, setIsProposalExist] = useState(false);
  // const [isErrorVisible, setisErrorVisible] = useState(false);
  const [proposalInfo, setProposalInfo] = useState();
  const [adminComments, setAdminComments] = useState();
  const [referbackedPoints, setReferbackedPoints] = useState('');


  const [proposalStatusData, setProposalStatusData] = useState();
  const [isCopied,setIscopied]=useState(false)
  const [isCopied1,setIscopied1]=useState(false)


  const [isCustomerCareModalVisible, setIsCustomerCareModalVisible] =
    useState(false);
  const navigate = useNavigate();
const handleCopy = (phoneNumber) => {
  navigator.clipboard.writeText(phoneNumber);
  setIscopied(true)
};
const handleCopy1 = (phoneNumber) => {
  navigator.clipboard.writeText(phoneNumber);
  setIscopied1(true)
};

  const fetchData = useCallback(async (proposaldata) => {
    // setLoading(true);

    try {
      const getData = await fetchProposalDetails(proposalNumber);
      console.log(getData)
      if (getData.status) {
        setProposalInfo(getData?.data);
        setAdminComments(getData?.admin_comment)
        setProposalStatusData(getData?.data?.breakin_status_name)
        storeDataLocalStorage('Claim_proposalDetails',getData)

        let referbackString = '';

if (getData?.data?.is_referback_images === 1) {
  referbackString += 'images';
}

if (getData?.data?.is_referback_checkpoint === 1) {
  if (referbackString !== '') {
    referbackString += ', ';
  }
  referbackString += 'checkpoint';
}

if (getData?.data?.is_referback_video === 1) {
  if (referbackString !== '') {
    referbackString += ', ';
  }
  referbackString += 'video';
}

setReferbackedPoints(referbackString)

      } else {
        // setisErrorVisible(true);
      }
    } catch (error) {
      console.error("Error fetching proposal details:", error);
      // setisErrorVisible(true);
    } finally {
      // setLoading(false);
    }
  }, [proposalNumber]);
  // Make sure to include all dependencies used within useCallback.

  const fetchProposal = useCallback(async () => {
  
    
    const response = await fetchLoginDataByProposalNoAPi(proposalNumber); // Call API function with proposal number
    if (response?.status) {

      setIsProposalExist(true);
      fetchData(response?.data?.user_details);
      storeDataLocalStorage('Claim_loginDetails',response?.login_data)

    }
  }, [proposalNumber, setIsProposalExist, fetchData]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const toggleCustomerCareModal = () => {
    setIsCustomerCareModalVisible(!isCustomerCareModalVisible);
  };

  
  return (
    <div className="container">
                <Header /> {/* Include the Header component */}

      {" "}
      {/* Use CSS module class */}
      {isProposalexist ? (
        <div className={"optionCard"}>
          <div className={"rowlogo"}>
            <img
              className={"logoImage"}
              src={CarIcon}
              alt="Proposal Logo"
            />

            <div className={"ol6"}>
              <p>
                <span className="label">Prop No:</span>{" "}
                <span className="value">{proposalInfo?.proposal_no}</span>
              </p>
              <p>
                <span className="label">Reg No:</span>{" "}
                <span className="value">{proposalInfo?.v_registration_no}</span>
              </p>
              <p>
                <span className="label">Insured Name:</span>{" "}
                <span className="value">{proposalInfo?.insured_name}</span>
              </p>
            </div>
          </div>
          <div className={"row"}>
            <div className={"col12"}>
              {/* <p>
                <span className="label">Proposal No:</span>{" "}
                <span className="value">{proposalInfo?.proposal_no}</span>
              </p> */}
              {/* <p>
                <span className="label">Inspection Type:</span>{" "}
                <span className="value">{proposalInfo?.inspection_type}</span>
              </p> */}
              <p>
                <span className="label"> Proposal Start Date:</span>{" "}
                <span className="value">{proposalInfo?.proposal_start_date}</span>
              </p>
              <p>
                <span className="label"> Proposal End Date:</span>{" "}
                <span className="value">{proposalInfo?.proposal_end_date}</span>
              </p>
              <p>
                <span className="label">Registration Year:</span>{" "}
                <span className="value">{proposalInfo?.v_manufacture_year}</span>
              </p>
              <p>
                <span className="label">Make:</span>{" "}
                <span className="value">{proposalInfo?.v_make_id}</span>
              </p>
              <p>
                <span className="label">Model:</span>{" "}
                <span className="value">{proposalInfo?.model_name}</span>
              </p>
              <p>
                <span className="label">Variant:</span>{" "}
                <span className="value">{proposalInfo?.variant_name}</span>
              </p>
              <p>
                <span className="label">Engine No:</span>{" "}
                <span className="value">{proposalInfo?.v_engine_no}</span>
              </p>
              <p>
                <span className="label">Chassis No:</span>{" "}
                <span className="value">{proposalInfo?.v_chassis_no}</span>
              </p>
              <p>
                <span className="label">Product Type:</span>{" "}
                <span className="value">{proposalInfo?.product_type_name}</span>
              </p>
              {proposalStatusData ===
                "Inprogress" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">Under Review</span>
                </p>
              )}

              {proposalStatusData ===
                "Rejected" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">Rejected</span>
                </p>
              )}
              {proposalStatusData ===
                "Completed" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">Approved By Admin</span>
                </p>
              )}
               {proposalStatusData ===
                "Completed" && (
                <p>
                  <span className="label">Admin Comments:</span>
                  <span className="value">{adminComments?.comment}</span>
                </p>
              )}
              {proposalStatusData ===
                "Rejected" && (
                <p>
                  <span className="label">Admin Comments:</span>
                  <span className="value">{adminComments?.comment}</span>
                </p>
              )}
              {proposalStatusData ===
                "Referback" && (
                <p>
                  <span className="label">Admin Comments:</span>
                  <span className="value">{adminComments?.comment}</span>
                </p>
              )}
              {proposalStatusData ===
                "Referback" && (
                <p>
                  <span className="label">ReferBack Point:</span>
                  <span className="value">{referbackedPoints}
                     
                  </span>
                </p>
              )}
              {proposalStatusData ===
                "Referback" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">
                    Your Breakin has been Referback by admin 
                  </span>
                </p>
              )}
               
            </div>
          </div>

          <div className={"rowlogo"}>
            <button
              className={"customercare"}
              onClick={toggleCustomerCareModal}
            >
              <img src={CallIcon} alt="Call Icon" />
              <span>Call Customer Care</span>
            </button>
            {(proposalStatusData === "Pending" ||
              proposalStatusData ===
                "Referback") && (
              <button
                className={"StartInspection"}
                onClick={() =>     navigate('/CheckPermission')}
              >
                <img src={StartInspection} alt="Start Inspection Icon" />
                <span>Start Inspection</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>proposal not found</p>
      )}
        {isCustomerCareModalVisible && (
  <div className="customerCareModal">
    <div className="modalContent">
      <img onClick={toggleCustomerCareModal} src={IconClose} alt='close' style={{height:'25px',width:'25px',position:'absolute',right:20,top:10}}/>
      <h4>Customer Care</h4>
      <div className="phoneNumbers">
        <img src={CustomerCare} alt="customer care" style={{ height: '25px', width: '35px' }} /> 
        <span>+919372777632</span>
        <p style={{fontSize:'14px',marginLeft:'10px',marginRight:'10px'}} onClick={() => handleCopy('+919372777632')}>{isCopied?'Copied':'Copy'}</p>
        <a href="https://wa.me/9372777632" target="_blank" rel="noopener noreferrer">
          <img src={WhatsappIcon} alt="WhatsApp" style={{ height: '25px', width: '25px' }} />
        </a>
      </div>
      <div className="phoneNumbers">
        <img src={CustomerCare} alt="customer care" style={{ height: '25px', width: '35px' }} /> 
        <span>+919137857548</span>
        <p style={{fontSize:'14px',marginLeft:'10px',marginRight:'10px'}} onClick={() => handleCopy1('+919137857548')}>{isCopied1?'Copied':'Copy'}</p>
        <a href="https://wa.me/9137857548" target="_blank" rel="noopener noreferrer">
          <img src={WhatsappIcon} alt="WhatsApp" style={{ height: '25px', width: '25px' }} />
        </a>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ProposalInfoPage;
