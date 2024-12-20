/* eslint-disable */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InspectionCheckpoint.css";
import { fetch_Checkpoint_inspection_question } from "../../Api/fetchQuestion";
import { submit_inspection_checkpointData, updateProposalSteps } from "../../Api/submitInspectionQuestion";
import { fetchDataLocalStorage } from "../../Utils/LocalStorage";
import CommonModal from "../../Component/CommonModel";
import Header from "../../Component/Header";
import InspectionModalRules from "../../Component/Modal/InspectionModalRules";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encrypt } from "../../Utils/encryption";
import { makeApiCall } from "../../Api/makeApiCall";
import { Api_Endpoints } from "../../Api/ApiEndpoint";
import FullPageLoader from "../../Component/FullPageLoader";

export const InspectionCheckpoint = ({ route }) => {
  const [IsInstructionModalVisible,setIsInstructionModalVisible]=useState(false)
  const [IsVideo,setIsVideo]=useState(false)
  const [CurrentQuestion,setcurrentQuestion]=useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestDone, setIsRequestDone] = useState(false);
  const [FailedArray, setFailedArray] = useState('');
  const [proposalInfo, setProposalInfo] = useState(null);
  const [localdata, setLocaldata] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [submittedQuestion, setsubmittedQuestion] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState({}); // State to track submission status
  const openModal = (message, type) => {
    
    // setModalMessage(message);
    // setModalType(type);
    // setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const InstructioncloseModal = () => {
    setIsInstructionModalVisible(false);
    // navigate('/Camera',{replace:true})
  };
  const [checkpointQuestion, setCheckpointQuestion] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCustomerCareModalVisible, setIsCustomerCareModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch checkpoint inspection questions
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true)
    // const response = await fetch_Checkpoint_inspection_question();
    
    const response = await makeApiCall(Api_Endpoints?.fetch_Checkpoint_inspection_question_Endpoint,'POST',)
    if (response.status) {
      setCheckpointQuestion(response.data);
      const initialErrorMessages = {};
      response.data.forEach((question) => {
        initialErrorMessages[question.breakin_inspection_post_question_id] = "";
      });
      setErrorMessages(initialErrorMessages);
    }
    setIsLoading(false)
   }, [submittedQuestion]);

  // const getLabelForValue = (value) => {
  //   switch (value) {
  //     case 1:
  //       return "Safe";
  //     case 2:
  //       return "Scratch";
  //     case 3:
  //       return "Pressed";
  //     case 4:
  //       return "Broken";
  //     case 5:
  //       return "Good";
  //     case 6:
  //       return "Not Working";
  //     case 7:
  //       return "Not Available";
  //     default:
  //       return "";
  //   }
  // };


  // Function to handle radio button change
  const handleRadioChange = (questionId, answerId) => {

    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });

    // Remove error message for the current question
    setErrorMessages({
      ...errorMessages,
      [questionId]: "",
    });
  };

  // Function to handle form submission

  function getNextReferbackStep(data) {
    if (data.is_referback_checkpoint === 1) {
      setNextPath('InspectionCheckpoint')
      return "checkpoint";
    } else if (data.is_referback_images === 1) {
      setNextPath('showInspectionImages')
      return "images";
    } else if (data.is_referback_video === 1) {
      setNextPath('VideoRecord')
      return "video";
    } else {
      // Handle the case when none of the referback points are available
      return "No referback points available";
    }
  }
  const goNext=async()=>{
    let nextStep='images'

    if(proposalInfo?.is_referback_images===0&&proposalInfo?.breakin_status===3&&proposalInfo?.is_referback_video===0)
    {
       nextStep='completed'


    }  else if(proposalInfo?.is_referback_images===0&&proposalInfo?.breakin_status===3&&proposalInfo?.is_referback_video===1){

      nextStep='video'
    }
    

const data = {
  user_id:localdata?.user_details?.id,
  proposal_id:localdata?.proposal_data?.proposal_id,
  breakin_steps:nextStep


}
    const apires = await updateProposalSteps(data)
    if(apires){

      if(nextStep==='images'){

setIsInstructionModalVisible(true)
}
else if((nextStep==='completed')){
  navigate(`/proposal-info/${encrypt(String(localdata?.proposal_data?.proposal_id))}`,{replace:true})

}else if((nextStep==='video')){
  // navigate('/videoRecord',{replace:true})
  setIsVideo(true)
  setIsInstructionModalVisible(true)



}


}else{
  toast.error(apires?.message, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "colored",
  });



}


  }
  const handleSubmit = async () => {
    setIsSubmitting(true)
    if (allQuestionsAnswered()) {
      const formattedData = Object.entries(selectedAnswers)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');    
      const data ={
        user_id:localdata?.user_details?.id,
        proposal_list_id:proposalInfo?.id,
        question_answer_ids:`${formattedData}`,
        product_type_id:proposalInfo?.v_product_type_id,
        breakin_steps:'images'
      }


const submittedresponse = await submit_inspection_checkpointData(data);
if(submittedresponse?.status){
  toast.success(submittedresponse?.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
setIsRequestDone(true)

}else{
  toast.error(submittedresponse?.message, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "colored",
  });

}
setIsSubmitting(false)


    } else {
      let isQuestionRequired=false
      // Display error messages for unanswered questions
      const updatedErrorMessages = {};
      checkpointQuestion.forEach((question) => {
        if (!selectedAnswers[question.breakin_inspection_post_question_id]) {
          updatedErrorMessages[question.breakin_inspection_post_question_id] =
            "This question is required";
            isQuestionRequired=true
        } else {
          updatedErrorMessages[question.breakin_inspection_post_question_id] =
            "";
            isQuestionRequired=false
        }
      });
      toast.error('All Questions are  Mandatory', {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
      

      setErrorMessages(updatedErrorMessages);
    }
    setIsSubmitting(false)

// navigate('/camera')
  };


  const isQuestionSubmitted = (questionId) => {
    return selectedAnswers.hasOwnProperty(questionId);
  };
  

 
  // Function to check if all questions have been answered
  const allQuestionsAnswered = () => {
    for (const question of checkpointQuestion) {
      if (!selectedAnswers[question.breakin_inspection_post_question_id]) {
        return false;
      }
    }
    return true;
  };

  const fetchDataFromLocalStorage = async () => {
    const localdatares = await fetchDataLocalStorage('Claim_loginDetails')
    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')

    if (localdatares && proposalInfo) {
      setLocaldata(localdatares)
      setProposalInfo(proposalInfo?.data)
    }

  }
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchDataFromLocalStorage()
  }, [])

  useEffect(()=>{},[FailedArray,localdata,IsVideo])
  return (
    <div className="checkpointcontainer">
                      <Header checkLocal={true} /> {/* Include the Header component */}

      {/* <CommonModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} type={modalType} /> */}

      <div className={"optionCard"}>
        {checkpointQuestion.map((question) => (
          <div key={question.breakin_inspection_post_question_id}>
            <p>{question.question}</p>
            {/* Render label based on submission status */}
            <span>{isQuestionSubmitted[question.breakin_inspection_post_question_id]}</span>
            <div className="options">
              {Object.keys(question.answers_obj).map((answerId) => (
                <div key={answerId}>

                  <input
                    type="radio"
                    id={`answer_${question.breakin_inspection_post_question_id}_${answerId}`}
                    name={`question_${question.breakin_inspection_post_question_id}`} // Unique name attribute
                    value={question.answers_obj[answerId]}
                    checked={
                      String(selectedAnswers[
                        question.breakin_inspection_post_question_id
                      ]) === String(answerId)
                    }
                    onChange={() =>
                      handleRadioChange(
                        question.breakin_inspection_post_question_id,
                        String(answerId)
                      )
                    }
                  />
                  <label
                    htmlFor={`answer_${question.breakin_inspection_post_question_id}_${answerId}`}
                  >
                    {question.answers_obj[answerId]}
                  </label>
                </div>
              ))}
            </div>
            <span className="error">
              {errorMessages[question.breakin_inspection_post_question_id]}
            </span>
          </div>
        ))}

<div style={{marginTop:'12px',justifyContent:'center',display:'flex',
alignItems:'center'}}>

      {
                  isRequestDone ? 

        <button onClick={goNext} disabled={isSubmitting}>
          Next
        </button>
        :
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        
        }

   
</div>

      </div>
      
      {/* {isLoading && (
        <div className="loaderContainer">
                    <div className="loaderContainer1">

          <div className="loader"></div>
          <p className="loaderText">{`${CurrentQuestion}/${Object.keys(selectedAnswers).length+1} Submitting Question`}</p>
        </div>
        </div>
      )} */}

<InspectionModalRules
        isVisible={IsInstructionModalVisible}
        onClose={InstructioncloseModal}
        proposalData={proposalInfo}
        isVideo={IsVideo}
        
      />
      <FullPageLoader loading={isLoading}/>

    </div>
  );
};

export default InspectionCheckpoint;
