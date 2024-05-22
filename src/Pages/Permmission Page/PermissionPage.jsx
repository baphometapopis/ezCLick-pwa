import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProposalSteps } from '../../Api/submitInspectionQuestion';
import Header from '../../Component/Header';
import { fetchDataLocalStorage, storeDataLocalStorage } from '../../Utils/LocalStorage';
import './PermissionPage.css'; // Import CSS file for styling
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchProposalDetails } from '../../Api/fetchProposalDetails';
const PermissionPage = () => {
  const navigate=useNavigate()
  const [isMobile, setIsMobile] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [canStartInspection, setCanStartInspection] = useState(false);
   const [LocalData, setLocaldata] = useState([]);
   const [nextPath, setNextPath] = useState('InspectionCheckpoint');

  const [ProposalInfo, setProposalInfo] = useState([]);

  useEffect(() => {
    // Check if the page is accessed on a mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log(userAgent)
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));

    // Check for camera permission
    if (isMobile) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false));
    }

    // Check for geolocation permission
    if (isMobile) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  }, [isMobile]);

  useEffect(() => {
    // Check if both camera and location permissions are granted
    if (cameraPermission === true && locationPermission === true) {
      setCanStartInspection(true);
    } else {
      setCanStartInspection(false);
    }
  }, [cameraPermission, locationPermission]);

  const requestPermissions = () => {
    // Request camera and geolocation permissions
    if (isMobile) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false));

      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  };
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
  const getLocalData=async()=>{
    const reslocaldata = await fetchDataLocalStorage('Claim_loginDetails')

    const ProposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')
    console.log(reslocaldata,ProposalInfo)
    
    if (reslocaldata && ProposalInfo) {
      setLocaldata(reslocaldata)
      setProposalInfo(ProposalInfo?.data)
      if(ProposalInfo?.data?.breakin_status===3){
      const res=  getNextReferbackStep(ProposalInfo?.data)
     
      const postdata ={
        user_id:reslocaldata?.user_details?.id,
        breakin_steps:res,
        proposal_id:reslocaldata?.proposal_data?.proposal_id

      }
     const data = await updateProposalSteps(postdata)
     console.log(data,'sddsa')
      if(data?.status){

        const getData = await fetchProposalDetails(reslocaldata?.proposal_data?.proposal_no);
        console.log(getData,'Llllll')
        if(getData?.status){
          storeDataLocalStorage('Claim_proposalDetails',getData)

        }else{
          toast.error(getData?.message, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
          });
        }

       
      }else{
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
      
      
      
    }


  }

  useEffect(()=>{getLocalData()},[])

  useEffect(()=>{},[nextPath])

  return (
    <div className="container">
                            <Header checkLocal={true} /> {/* Include the Header component */}

      <div className="permission-content">
        <ul>
          <li>{cameraPermission ? '✅ Camera permission granted' : '❌ Camera permission denied'}</li>
          <li>{locationPermission ? '✅ Location permission granted' : '❌ Location permission denied'}</li>
          <li>{isMobile ? '✅ Mobile device detected' : '❌ Not a mobile device'}</li>
        </ul>
        <button onClick={requestPermissions} type='submit'>Request Permissions</button>
        {canStartInspection && <button onClick={()=>navigate(`/${nextPath}`, { replace: true })}>Start Inspection</button>}
      </div>
    </div>
  );
};

export default PermissionPage;
