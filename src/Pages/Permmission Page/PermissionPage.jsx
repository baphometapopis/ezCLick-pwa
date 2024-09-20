import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProposalSteps } from '../../Api/submitInspectionQuestion';
import Header from '../../Component/Header';
import { fetchDataLocalStorage, storeDataLocalStorage } from '../../Utils/LocalStorage';
import './PermissionPage.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchProposalDetails } from '../../Api/fetchProposalDetails';
import InspectionModalRules from '../../Component/Modal/InspectionModalRules';

const PermissionPage = () => {
  const navigate = useNavigate();
  const [IsInstructionModalVisible, setIsInstructionModalVisible] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [canStartInspection, setCanStartInspection] = useState(false);
  const [LocalData, setLocaldata] = useState([]);
  const [nextPath, setNextPath] = useState('InspectionCheckpoint');
  const [ProposalInfo, setProposalInfo] = useState([]);

  const InstructioncloseModal = () => {
    setIsInstructionModalVisible(false);
  };

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));

    if (isMobile) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false));
      
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  }, [isMobile]);

  useEffect(() => {
    if (cameraPermission === true && locationPermission === true) {
      setCanStartInspection(true);
    } else {
      setCanStartInspection(false);
    }
  }, [cameraPermission, locationPermission]);

  const requestPermissions = () => {
    window.location.reload();


    if (isMobile) {
      setCameraPermission(null);
      setLocationPermission(null);
      setCanStartInspection(false);
      
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false));

      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );

      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const resetPermissions = () => {
    alert(
      'To reset camera and location permissions:\n\n' +
      '1. Open your browser settings.\n' +
      '2. Go to Privacy and Security.\n' +
      '3. Find Site Settings and select it.\n' +
      '4. Under Permissions, find Camera and Location.\n' +
      '5. Reset the permissions for this site.'
    );
  };

  function getNextReferbackStep(data) {
    if (data.is_referback_checkpoint === 1) {
      setNextPath('InspectionCheckpoint');
      return "checkpoint";
    } else if (data.is_referback_images === 1) {
      setNextPath('showInspectionImages');
      return "images";
    } else if (data.is_referback_video === 1) {
      setNextPath('VideoRecord');
      return "video";
    } else {
      return "No referback points available";
    }
  }

  function redirectUser(data,showCheckpoint) {

    console.log(data,showCheckpoint,'lkjhgfdx')

    if (data === 'checkpoint') {
      if(showCheckpoint==0){
        setNextPath('camera');
        }else{

          setNextPath('InspectionCheckpoint');

      }
    } else if (data === 'images') {
      setNextPath('camera');
    } else if (data === 'video') {
      setNextPath('videoRecord');
    } else {
      return "No referback points available";
    }
  }

  const getLocalData = async () => {
    const reslocaldata = await fetchDataLocalStorage('Claim_loginDetails');
    const ProposalInfoRES = await fetchDataLocalStorage('Claim_proposalDetails');

    if (reslocaldata && ProposalInfoRES) {
      setLocaldata(reslocaldata);
      setProposalInfo(ProposalInfoRES?.data);

      if (ProposalInfoRES?.data?.breakin_status === 3) {
        const res = getNextReferbackStep(ProposalInfoRES?.data);
        const postdata = {
          user_id: reslocaldata?.user_details?.id,
          breakin_steps: res,
          proposal_id: reslocaldata?.proposal_data?.proposal_id
        };
        const data = await updateProposalSteps(postdata);

        if (data?.status) {
          const getData = await fetchProposalDetails(reslocaldata?.proposal_data?.proposal_no);
          if (getData?.status) {
            storeDataLocalStorage('Claim_proposalDetails', getData);
          } else {
            toast.error(getData?.message, {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "colored",
            });
          }
        } else {
          toast.error(data?.message, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
          });
        }
      }

      if (ProposalInfoRES?.data?.breakin_status === 0) {
        redirectUser(ProposalInfoRES?.data?.breakin_steps,ProposalInfoRES?.data?.is_question_checkpoint);
      }
    }
  };

  useEffect(() => {
    getLocalData();
  }, []);

  useEffect(() => { }, [nextPath]);

  return (
    <div className="container">
      <InspectionModalRules
        isVisible={IsInstructionModalVisible}
        // isVisible={true}
        onClose={InstructioncloseModal}
        isVideo={true}
        proposalData={ProposalInfo}
      />
      <Header checkLocal={true} /> {/* Include the Header component */}

      <div className="permission-content">
        <ul>
          <li>{cameraPermission ? '✅ Camera permission granted' : '❌ Camera permission denied'}</li>
          <li>{locationPermission ? '✅ Location permission granted' : '❌ Location permission denied'}</li>
          <li>{isMobile ? '✅ Mobile device detected' : '❌ Not a mobile device'}</li>
        </ul>
        <div style={{display:'flex'}}>
        <button onClick={requestPermissions} type='submit'>Request Permissions</button>
        {/* {true */}

        {canStartInspection 
        ? <button onClick={() => navigate(`/${nextPath}`, { replace: true })}>Start Inspection</button>:
        
        <button onClick={resetPermissions} type='button'>Manual Permission</button>
        
        }
        </div>
      </div>
    </div> 
  );
};

export default PermissionPage;
