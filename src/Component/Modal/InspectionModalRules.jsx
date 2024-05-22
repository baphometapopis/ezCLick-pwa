import React, { useEffect, useState } from 'react';
import { SampleImage, IconClose } from '../../Constant/ImageConstant';
import { fetch_Image_inspection_question } from '../../Api/fetchQuestion';
import  './InspectionModalRules.css'; // Import CSS file for styling
import {  useNavigate } from 'react-router-dom';

const InspectionModalRules = ({ isVisible, onClose, proposalData, isVideo }) => {

  const [isCameraVisible, setCameraVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const navigate = useNavigate();

  const openCamera = async () => {
    onClose();

    const fetchData = await fetch_Image_inspection_question();
    if (fetchData.status) {
      if (isVideo) {
        navigate('/VideoRecord', {
          proposalInfo: proposalData,replace:true
        });
      } else {
        navigate('/camera', {
          imageData: fetchData?.data?.filter(item => item.is_mand === '1'),
          proposalInfo: proposalData,replace:true
        });
        setCameraVisible(true);
      }
    } else {
      setIsErrorVisible(true);
    }
  };

  useEffect(() => { }, [isErrorVisible, isCameraVisible]);

  return (
<>
    {isVisible && (

<div className={"centeredView"}>
        <div className="modalView">
          <button className={"closeButton"} onClick={onClose}>
            <img src={IconClose} alt="Close Icon" />
          </button>
          <h2 className={"modalTitle"}>Guideline</h2>
          <p className={"modalText centeredText"}>
            Follow these steps for the self-inspection process to be successful
          </p>
          <img src={SampleImage} className={"InspectionRulesimage"} alt="Sample" />
          <div className={"scrollContainer"}>
            <p className={"scrollIndicator"}>Scroll down for more details</p>
            {isVideo ? (
              <>
                <p className="modalPoint">-> The video has to be captured during the daylight. Videos captured in basements or shades (ex. tree shades) will not be valid.</p>
                <p className="modalPoint">-> Ensure you capture the Engine number, Chassis number and odometer reading as part of the video.</p>
                <p className="modalPoint">-> In case of any dent or scratches, please capture it Clearly.</p>
                <p className="modalPoint">-> The RC copy and Previous Year Policy (if applicable) should be captured in the video either at the start or end.</p>
                <p className="modalPoint">-> Make sure you have high speed internet connection for a faster upload.</p>
                <p className="modalPoint">-> Review and submit the application.</p>
              </>
            ) : (
              <>
                <p className="modalPoint">-> Follow the handy guide to identify the chassis number and engine number of your vehicle.</p>
                <p className="modalPoint">-> Find out the car's chassis number that is engraved under the front bonnet of the car. However, in some cars, it is found next to the driver's door of the passenger's door. Ensure the chassis number is on the car's body, not on a sticker of the car's window.</p>
                <p className="modalPoint">-> Keep the car's Registration Certificate (RC) and the Previous Year Policy (PYP) documents handy as you need to Capture these in the self-inspection.</p>
                <p className="modalPoint">-> Clean your car's windshield and windows.</p>
                <p className="modalPoint">-> Check if your vehicle is parked in an open area with good sunlight for best quality photos.</p>
                <p className="modalPoint">-> As per the instructions on the screen, shoot a continuous photo of the vehicle.</p>
                <p className="modalPoint">-> Click photos of the vehicle according to the guide marks shown on the screen. This will help the Artificial Intelligence engine and inspection team behind the app to identify your vehicle condition.</p>
                <p className="modalPoint">-> Review and submit the application.</p>
              </>
            )}
          </div>
          <button className={"button"} style={{ backgroundColor: '#2196F3' }} onClick={openCamera}>
            {isVideo ? 'Start Video' : 'Start Camera'}
          </button>
        </div>
    
    
    </div>)}
    </>
    
  );
};

export default InspectionModalRules;
