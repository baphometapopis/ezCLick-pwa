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
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { encrypt } from "../Utils/encryption";
import FullPageLoader from "../Component/FullPageLoader";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compressedVideoUri, setCompressedVideoUri] = useState(null);
  const [isLoading,setisLoading]=useState(false)

  const [odometerError, setOdometerError] = useState(false); // Track odometer error

  const navigate = useNavigate();

  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails')
    const localproposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')
    if (localdata && localproposalInfo) {
      setLocaldata(localdata)
      setProposalInfo(localproposalInfo)
      setProposalNo(localdata?.proposal_data?.proposal_id)
    }
  }

  const submitVideo = async () => {
    // compressVideo()
    setIsSubmitting(true)
    if (!odometerReading) {
      setOdometerError(true); // Set odometer error if reading is not provided
      return; // Stop submission if odometer reading is missing
    }
    setisLoading(true)

    const videopath = {
      uri: videoblob,
      type: 'video/webm',
      name: 'video.webm',
    };
    const data = {
      user_id: LocalData?.user_details?.id,
      break_in_case_id: LocalData?.proposal_data?.breakin_inspection_id,
      proposal_id: LocalData?.proposal_data?.proposal_id,
      video: videoUri,
      odometer:odometerReading,
      breakin_steps:'completed'
    };

    const odometerres= await submit_odometer_Reading(data)
    const res = await submit_inspection_Video(data);
    if (res?.status) {

      // navigate(`/proposal-info/${ProposalNo}`,{replace:true});
      toast.success(res?.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });

         
      navigate(`/proposal-info/${encrypt(String(ProposalNo))}`,{replace:true});

    }
    else{


   toast.error(res?.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });

    }
    setIsSubmitting(false)
    setisLoading(false)

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
  // const compressVideo = async () => {
  //   console.log('[clicked compresor ',videoUri)
  //   const ffmpeg = new FFmpeg({ log: true });
  //   await ffmpeg.load();
  //   await ffmpeg.writeFile('input.webm', await fetchFile(videoUri));
  //   await ffmpeg.exec(['-i', 'input.webm', '-vcodec', 'libvpx', '-crf', '28', '-b:v', '1M', 'output.webm']);
  //   const inputData = await fetchFile(videoUri);
  //   const compressedData = await ffmpeg.readFile('output.webm');
  //   const inputFileSize = inputData.size;
  //   const compressedFileSize = compressedData.size;
  //   const compressedVideoUrl = URL.createObjectURL(new Blob([compressedData.buffer], { type: 'video/webm' }));
  //   // console.log('Input file size:', inputFileSize, 'bytes');
  //   // console.log('Compressed file size:', compressedFileSize, 'bytes');
  //   setCompressedVideoUri(compressedVideoUrl);
  // };
  

  useEffect(() => {
   
    // compressVideo();
  }, [videoUri]); 

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
            <button onClick={submitVideo}>{isSubmitting?'Submitting':'Submit'}</button>
            <button onClick={handleRetake}>Retake</button>
          </div>
        )}
      </div>
      <FullPageLoader loading={isLoading}/>
    </div>
  );
};

export default VideoPreview;
