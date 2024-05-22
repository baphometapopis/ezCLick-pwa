/*eslint-disable */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submit_inspection_Video } from "../Api/submitInspectionQuestion";
import { submit_odometer_Reading } from "../Api/submitOdometerReading";
import Header from "../Component/Header";
import { fetchDataLocalStorage } from "../Utils/LocalStorage";
import "./VideoPreview.css"; // Import CSS file for styling
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoPreview = () => {
  const { state } = useLocation();
  const { videoUri, videoblob } = state;
  const [LocalData, setLocaldata] = useState('');
  const [ProposalInfo, setProposalInfo] = useState('');
  const [ProposalNo, setProposalNo] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [odometerReading, setOdometerReading] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [odometerError, setOdometerError] = useState(false); // Track odometer error

  const navigate = useNavigate();

  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails')
    const localproposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')

      console.log(localproposalInfo)
    if (localdata && localproposalInfo) {
      setLocaldata(localdata?.login_data?.user_detailss)
      setProposalInfo(localproposalInfo)
      setProposalNo(localproposalInfo?.data?.proposal_no)
    }
  }

  const submitVideo = async () => {

    if (!odometerReading) {
      setOdometerError(true); // Set odometer error if reading is not provided
      return; // Stop submission if odometer reading is missing
    }
    toast.info("Uploading Video...", { autoClose: false });

    const videopath = {
      uri: videoblob,
      type: 'video/mp4',
      name: 'video.mp4',
    };
    console.log(LocalData)
    const data = {
      user_id: LocalData?.id??1,
      break_in_case_id: ProposalInfo?.break_in_case_id??1,
      proposal_id: ProposalInfo?.id??1,
      video: videoUri,
      odometer:odometerReading,
      breakin_steps:'completed'
    };
    console.log(videoUri,videoblob)

    const odometerres= await submit_odometer_Reading(data)
    console.log(odometerres,'odometerReading')
    const res = await submit_inspection_Video(data);
    if (res?.status) {
    toast.dismiss();

      // navigate(`/proposal-info/${ProposalNo}`,{replace:true});
      toast.success(res?.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });

            navigate(`/proposal-info/${ProposalNo}`,{replace:true});

    }
    else{
    toast.dismiss();


   toast.error(res?.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });

    }
  };

  useEffect(() => {
    // Get device ID
    const id = navigator.userAgent;
    setDeviceId(id);

    // Get user's current position
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const handleRetake = () => {
    navigate('/VideoRecord',{replace:true});
  };

  useEffect(() => {
    fetchDataFromLocalStorage();
  }, []);
  useEffect(()=>{},[LocalData])

  return (
    <div className="container">
      <Header checkLocal={true} />
      <div className={"optionCard1"}>
        <div className="input-container">
        <input
  type="text"
  placeholder="Odometer Reading"
  value={odometerReading}
  onChange={(e) => {
    const input = e.target.value;
    // Allow only numbers using regular expression
    if (/^\d*$/.test(input)) {
      setOdometerReading(input);
      setOdometerError(false); // Reset odometer error on input change
    }
  }}
  pattern="\d*" // Allow only numbers
/>

          {odometerError && <p className="error">Odometer reading is required</p>}
        </div>
        <video style={{ width: '100%', height: '80%' }} controls>
          <source src={videoblob} type="video/webm" />
        </video>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        {submitted ? (
          <p>Video Submitted!</p>
        ) : (
          <div className="button-container">
            <button onClick={submitVideo}>Submit</button>
            <button onClick={handleRetake}>Retake</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
