// UploadSignatureModal.js
import React, { useEffect, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Webcam from 'react-webcam';
import './UploadSignatureModal.css';

const UploadSignatureModal = ({ show, onClose }) => {
  const [manualUpload, setManualUpload] = useState(false);
  const [useSketchpad, setUseSketchpad] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageRef, setImageRef] = useState(null);
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

  const handleCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(imageRef, crop, 'newFile.jpeg');
      setCroppedImage(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

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

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  };

  const onImageLoaded = (image) => {
    setImageRef(image);
  };

  useEffect(() => {}, [uploadedImage]);
  const videoConstraints = {
    width: 280,
    height: 120,
    facingMode: { exact: "environment" }, // This will use the back camera if available

  };
  if (!show) {
    return null;
  }

  return (
    <div className="upload-signature-modal-backdrop">
      <div className="upload-signature-modal-content">
        <button className="upload-signature-modal-close" onClick={onClose}>
          X
        </button>
        <h2>Upload Signature</h2>
        {manualUpload ? (
          <>
            <button onClick={() => setUseCamera(true)}>Open Camera</button>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {useCamera && (
              <div className="webcam-container">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}

                />
                <button onClick={handleCapture}>Capture</button>
              </div>
            )}
          </>
        ) : useSketchpad ? (
          <div>Sketchpad (Implementation depends on chosen library)</div>
        ) : (
          <>
            <button onClick={() => setManualUpload(true)}>Manual Upload</button>
            <button onClick={() => setUseSketchpad(true)}>Use Sketchpad</button>
          </>
        )}

        {uploadedImage && (
          <>
            <ReactCrop
              src={uploadedImage}
              crop={crop}
              onImageLoaded={onImageLoaded}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
            />
            {uploadedImage && (
              <div>
                <h3>Cropped Image</h3>
                <img src={uploadedImage} alt="Cropped" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadSignatureModal;
