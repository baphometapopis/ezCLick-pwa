import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import './VideoRecorder.css';

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate(); // Corrected `navigation` to `navigate`
  const videoConstraints = {
    facingMode: { exact: "environment" }, // Use back camera if available
  };
  const MAX_VIDEO_DURATION = 90; // Maximum video duration in seconds
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId;
    if (capturing) {
      intervalId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000); // Update elapsed time every second
    }
    return () => clearInterval(intervalId);
  }, [capturing]);

  useEffect(() => {
    if (recordedChunks.length > 0 && !capturing) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const fileName = "video.webm";
      const videoFile = new File([blob], fileName, { type: "video/webm" });
      const videoUri = URL.createObjectURL(blob);
      navigate("/VideoPreview", {
        state: {
          videoUri: videoUri,
          videoFile: videoFile,
        },
      });
    }
  }, [recordedChunks, capturing, navigate]);

  const handleStartCaptureClick = () => {
    setCapturing(true);
    setElapsedTime(0); // Reset elapsed time when capturing starts
    try {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();

      // Stop capturing and save video after MAX_VIDEO_DURATION seconds
      setTimeout(() => {
        handleStopCaptureClick();
      }, MAX_VIDEO_DURATION * 1000);
    } catch (error) {
      console.error("Error starting MediaRecorder: ", error);
    }
  };

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  };

  const handleStopCaptureClick = () => {
    try {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    } catch (error) {
      console.error("Error stopping MediaRecorder: ", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="camera-container">
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          height={windowSize.height}
          videoConstraints={videoConstraints}
        />
        <div className="capture-button-container">
          {!capturing ? (
            <div onClick={handleStartCaptureClick} className="capture-button"></div>
          ) : (
            <div onClick={handleStopCaptureClick} className="video-duration">
              <div className="capture-button">
                <div className="stop-rec" />
              </div>
              <p className="duration-timer">
                {formatTime(elapsedTime)} / {formatTime(MAX_VIDEO_DURATION)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
