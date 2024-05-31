import React, { useEffect, useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Webcam from 'react-webcam';
import SignaturePadComponent from '../../SignaturePadComponent';
import './UploadSignatureModal.css';

const UploadSignatureModal = ({ show, onClose }) => {
  const [manualUpload, setManualUpload] = useState(false);
  const [useSketchpad, setUseSketchpad] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const webcamRef = useRef(null);

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
    width: 300,
    height: 120
  };

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
        {manualUpload ? (
          <div style={{ display: 'flex' }}>
            <button onClick={() => setUseCamera(true)}>Open Camera</button>
            <input style={{ width: '85%' }} type="file" accept="image/*" onChange={handleFileUpload} />
          </div>
        ) : useSketchpad ? (
          <div>

<div >
  <SignaturePadComponent />
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
          <>
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
              <button style={{ position: 'relative', top: '150px' }} onClick={generateCroppedImage}>Crop Image</button>
            </div>
          </>
        )}

        {croppedImage && (
          <div>
            <h3>Cropped Image</h3>
            <img src={croppedImage} alt="Cropped" style={{ height: '120px', width: '280px' }} />
            <button>Upload Signature</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSignatureModal;
