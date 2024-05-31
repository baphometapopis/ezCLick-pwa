import React, { useEffect, useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Webcam from 'react-webcam';
import { uploadSignature } from '../../../Api/uploadSignature';
import SignaturePadComponent from '../../SignaturePadComponent';
import './UploadSignatureModal.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UploadSignatureModal = ({ show, onClose ,data}) => {
  const [manualUpload, setManualUpload] = useState(false);
  const [useSketchpad, setUseSketchpad] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedSigmnature,setUploadedSignature]=useState(false)


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUploadedImage(imageSrc);
    setUseCamera(false);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixels);
      setUploadedImage(null);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  const getCroppedImg = (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      const base64Image = canvas.toDataURL('image/jpeg');
      resolve(base64Image);
    });
  };

  const clearState = () => {
    setManualUpload(false);
    setUseSketchpad(false);
    setUseCamera(false);
    setUploadedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppedImage(null);
  };

  useEffect(() => {
    return () => {
      clearState();
    };
  }, []);

  const handleClose = () => {
    clearState();
    onClose();
  };

  const videoConstraints = {
    // facingMode: 'user',
    facingMode: { exact: "environment" }, // This will use the back camera if available
    width: 120,
    height: 300
  };

  const getSignature=(image)=>{
    setCroppedImage(image)
  }

const handleSignatureUpload=async()=>{


  const res = await uploadSignature(data?.id,croppedImage)
  console.log(res?.status,'Upload Signature')

  if(res?.status){

    toast.success(res?.message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
    });

    window.location.reload();

  }else{
    toast.error(res?.message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
    });


  }

}
useEffect(()=>{},[uploadedSigmnature])


  if (!show) {
    return null;
  }

  return (
    <div className="upload-signature-modal-backdrop">
      <div className="upload-signature-modal-content">
        <button className="upload-signature-modal-close" onClick={handleClose}>
          X
        </button>
        <h2>Upload Signature</h2>
        <p>Please upload or draw the correct signature. It will be verified during the claim process.</p>

        {manualUpload ? (
          <div style={{ display: 'flex' }}>
            <button onClick={() => setUseCamera(true)}>Open Camera</button>
            <input style={{ width: '85%' }} type="file" accept="image/*"                           onClick={(e) => (e.target.value = null)} // This will reset the input file

          onChange={handleFileUpload} />
          </div>
        ) : useSketchpad ? (
          <div>

<div >
  <SignaturePadComponent  getSignature={getSignature}/>
</div>

          </div>
          ) : (
          <>
            <button onClick={() => setManualUpload(true)}>Manual Upload</button>
            <button onClick={() => setUseSketchpad(true)}>Use Sketchpad</button>
          </>
        )}

        {useCamera && (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
            <button style={{ marginTop: '20px' }} onClick={handleCapture}>Capture</button>
          </div>
        )}

        {uploadedImage && (
          <div style={{backgroundColor:'white'}}>
            <div className="crop-container">
              <Cropper
                image={uploadedImage}
                crop={crop}
                zoom={zoom}
                aspect={300 / 120}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div>
              <button  onClick={generateCroppedImage}>Crop Image</button>
            </div>

          </div>
        )}

        {croppedImage && (
          <div>
            <h3>Signature</h3>
            <img src={croppedImage} alt="Cropped" style={{ height: '120px', width: '280px' }} />
            {
                 !uploadedSigmnature?
              <button onClick={handleSignatureUpload}>Upload Signature</button>:
              <button onClick={handleSignatureUpload}>Done</button>

              
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSignatureModal;
