/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./ShowMandatoryInspectionimages.css"; // Import your CSS file
import { useLocation, useNavigate } from "react-router-dom";
import { convertImageToBase64, extractBase64FromDataURI } from "../../Utils/convertImageToBase64";
import { submit_inspection_Images, updateProposalSteps } from "../../Api/submitInspectionQuestion";
import { fetch_Image_inspection_question } from "../../Api/fetchQuestion";
import Header from "../../Component/Header";
import { fetchDataLocalStorage } from "../../Utils/LocalStorage";
import InspectionModalRules from "../../Component/Modal/InspectionModalRules";
import { getFullReport } from "../../Api/fetchReferBackInspection";

const ShowinspectionImages = ({ route }) => {
  const [IsInstructionModalVisible,setIsInstructionModalVisible]=useState(false)

  const [selectedImage, setSelectedImage] = useState(null);
  const [isRequestDone,setIsRequestDone]=useState(false)
  const [CurrentQuestion,setcurrentQuestion]=useState('');
  const [SubmittedQuestions,setSubmittedQuestions]=useState('');
  const [SubmittedImages,setsubmittedImages]=useState('');
  const [FailedArray,setFailedArray]=useState('');
  const [FinalData,setFinalData]=useState('');
  const [localdata, setLocaldata] = useState(null);




  const InstructioncloseModal = () => {
    setIsInstructionModalVisible(false);
    navigate('/VideoRecord',{replace:true})
  };
  const [proposalInfo,setProposalInfo]=useState()

  const referenceData = [
    {"name": "Odometer with Engine on Position", "code": "autometer_engine"},
    {"name": "Windscreen Inside to Outside", "code": "windscreen_inside_outside"},
    {"name": "Windscreen Outside to Inside", "code": "windscreen_outside_inside"},
    {"name": "Front Image", "code": "front_image"},
    {"name": "Left Image", "code": "left_image"},
    {"name": "Rear Image", "code": "rear_image"},
    {"name": "Dicky Open", "code": "dicky_open"},
    {"name": "Right Image", "code": "right_image"},
    {"name": "Engraved Chassis", "code": "car_chassis_print"},
    {"name": "Open Engine Compartment", "code": "open_engine_compartment"},
    {"name": "Under Carriage Image", "code": "under_the_chassis_embossed_chassis_photo"},
    {"name": "PUC Copy", "code": "puc_copy"},
    {"name": "Dashboard Copy", "code": "dashboard_copy"},
    {"name": "RC Copy", "code": "rc_copy"},
    {"name": "Pervious Insurance Copy", "code": "pervious_insurances"},
    {"name": "Selfie with car", "code": "selfie_with_car"},
    {"name": "Additional Image1", "code": "addtion1"},
    {"name": "Additional Image2", "code": "addtion2"},
    {"name": "Additional Image3", "code": "addtion3"},
    {"name": "Front Left Image", "code": "front_left_image"},
    {"name": "Front Right Image", "code": "front_right_image"},
    {"name": "Rear Left Image", "code": "rear_left_image"},
    {"name": "Rear Right Image", "code": "rear_right_image"}
  ]


  function mapData(refData, namesData, codesData) {

console.log(refData,'<<<<<<<<<<<REF DATA >>>>>>>>>>>>>>>',namesData,'<<<<<<<<<<<<<<<NAMES DATA>>>>>>>>>>>>>>>>>>',codesData,'<<<<<<<<<<<<<<<<<CODES DATA>>>>>>>>>>>>>>>')
    
    let mappedArray = [];
    
    refData.forEach(nameItem => {
  
      const codeItem = codesData[nameItem.code]; // Access property directly
      const refItem = namesData.find(item => item.name === nameItem.name);
  
        
      if (codeItem && refItem) {
        const mappedItem = {
          id: refItem.id,
          name: refItem.name,
          is_mand: refItem.is_mand,
          sample_image_url: refItem.sample_image_url,
          "Inspection_Image": codeItem // Access property directly
        };
        mappedArray.push(mappedItem);
      }
    });
    
  
    return mappedArray;
  }

  const fetchDataFromLocalStorage = async () => {
    const reslocaldata = await fetchDataLocalStorage('Claim_loginDetails')
    const resproposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')
    let imageRes = await fetch_Image_inspection_question();



    console.log('<<<<<<<<<<<<<',reslocaldata?.proposal_data?.proposal_id,resproposalInfo,imageRes)

    const data ={
      proposal_id:reslocaldata?.proposal_data?.proposal_id,
      user_id:reslocaldata?.user_details?.id,
      break_in_case_id:reslocaldata?.proposal_data?.breakin_inspection_id
    }
    

    const uploadedimage = await getFullReport(data);



    if (reslocaldata && resproposalInfo && uploadedimage?.status) {

    let filteredimage= imageRes?.data
if(resproposalInfo?.data?.breakin_status===3){
  const selectedIds = [1, 2,];

   filteredimage=  imageRes?.data.filter(item => selectedIds.includes(item.id));
  console.log(filteredimage,'Filtered')


}


      const resData = mapData(referenceData,filteredimage,uploadedimage?.breakin_details)


      
      console.log(reslocaldata,resproposalInfo,imageRes,resData)

      setLocaldata(reslocaldata)
      setProposalInfo(resproposalInfo)
      setFinalData(resData)
    }
  }


  const [isLoading, setIsLoading] = useState(false);
const navigate =useNavigate()
  const { state } = useLocation();
  // const { capturedImagesWithOverlay,proposalInfo } = state;
  // const { capturedImagesWithOverlay,proposalInfo } = state;

  const [capturedImagesWithOverlay,setCapturedImagesWithOverlay]=useState()


  const goNext=async()=>{

    let nextStep='video'

    if(!proposalInfo?.data?.is_referback_video&&proposalInfo?.data?.breakin_status===3)
    {
       nextStep='completed'


    }  
    

const data = {
  user_id:localdata?.user_details?.id,
  proposal_id:localdata?.proposal_data?.proposal_id,
  breakin_steps:nextStep


}
    const apires = await updateProposalSteps(data)
    if(apires){

      if(nextStep==='video'){

setIsInstructionModalVisible(true)}else{
  navigate(`/proposal-info/${localdata?.proposal_data?.proposal_no}`,{replace:true})

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



  const handleSubmit = () => {
    // setIsSubmitted(false); // Reset submitted state
    if (!isRequestDone) {
   

      FilterImages();
    }
  };

  async function submitQuestions(questionDataList) {
    const sortedList = questionDataList.sort((a, b) => {
      const questionIdA = parseInt(a.question_id, 10);
      const questionIdB = parseInt(b.question_id, 10);
      if (questionIdA < questionIdB) {
        return -1;
      } else if (questionIdA > questionIdB) {
        return 1;
      } else {
        return 0;
      }
    });
    setIsLoading(true);
    const failedSubmissionsArray = [];
    const questiondone = [];
    const questiondoneImages = [];
  
    try {
      for (const questionData of sortedList) {
        let data = {
          break_in_case_id: questionData?.break_in_case_id,
          question_id: questionData?.question_id,
          user_id: localdata?.pos_login_data?.id,
          proposal_list_id: questionData?.proposal_list_id,
          ic_id: questionData?.ic_id,
          // answer_id: questionData?.answer_id,
          answer_id:extractBase64FromDataURI(questionData?.answer_id),

          inspection_type: questionData?.inspection_type,
          part: questionData?.part,
        };
        try {
          const submittedresponse = await submit_inspection_Images(
            data,
            'From Submit Function',
          );
          if (submittedresponse?.status) {
            setcurrentQuestion(questionData?.question_id);
            console.log(
              `Question ${questionData?.question_id} submitted successfully`,
            );
            questiondone.push(Number(questionData?.question_id));
            questiondoneImages.push(questionData?.part);
            console.log(
              questionData?.part,
              'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
            );
            setcurrentQuestion(data?.question_id)
          } else {
          }
        } catch (error) {
          console.error(
            `Error submitting question ${questionData?.question_id}: ${error.message}`,
          );
        }
        // Add delay of 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setsubmittedImages(questiondoneImages);
      setSubmittedQuestions(questiondone);
    } catch (error) {
      console.log(`Error submitting questions: ${error.message}`);
    }
    setIsLoading(false);
    setFailedArray(failedSubmissionsArray);
    setIsRequestDone(true);
  }
  

  async function FilterImages() {
    const sendPOSTDATA = [];
    for (const questionId of fetchedQuestion) {
      capturedImagesWithOverlay.map(async image => {
        // console.log(questionId.name, image);
        if (image.part === questionId.name) {
          let data = {
            break_in_case_id: proposalInfo?.break_in_case_id,
            question_id: questionId?.id,
            user_id: localdata?.pos_login_data?.id,
            proposal_list_id: proposalInfo?.id,
            ic_id: proposalInfo?.ic_id,
            answer_id: image?.uri,
            part: image.part,
            inspection_type: proposalInfo?.inspection_type,
          };

          sendPOSTDATA.push(data);
        }
      });
    }
    submitQuestions(sendPOSTDATA);
  }



  const handleImagePress = (uri) => {
    setSelectedImage(uri);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchDataFromLocalStorage() ;}, []);
    useEffect(()=>{},[CurrentQuestion,FinalData])


  return (
    <div style={{backgroundColor:'#F1FBFF'}}>
    <Header checkLocal={true}/> {/* Include the Header component */}

    <div className="container1">

  {FinalData&&    <div className="imageGrid">
        {FinalData?.map((item, index) => (
          <div key={index} className="imageContainer">
          
            <img
              className="image"
              src={item?.Inspection_Image}
              alt={item?.part}
              onClick={() => handleImagePress(item)}
            />
            <p className="overlayText">{item?.name}</p>
           
          
          </div>
        ))}
      </div>}


      {
                  true ? 

        <button onClick={goNext} >
          Next
        </button>
        :
        <button
        className="submitButton"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
        
        }

   

<InspectionModalRules
        isVisible={IsInstructionModalVisible}
        onClose={InstructioncloseModal}
        isVideo={true}
        
      />

      {isLoading && (
        <div className="loaderContainer">
          <div className="loaderContainer1">
          <div className="loader"></div>
          <p className="loaderText">{`${CurrentQuestion}/${capturedImagesWithOverlay.length+1} Submitting Question`}</p>
          </div>
        </div>
      )}
      {selectedImage && (
        <div className="modalContainer">
          <div className="closeButton" onClick={handleModalClose}>
            Close
          </div>
            <div className="previewImagecontainer">
          <img
            className="fullScreenImage"
            src={selectedImage?.Inspection_Image}
            alt="Full Screen"
          />
           <button style={{backgroundColor:'orange',fontSize:'18px'}}  onClick={()=>    navigate('/camera',{replace:true,state:{path:'RetakeImage',data:[selectedImage]}})
}>
          retake
        </button>
</div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ShowinspectionImages;
