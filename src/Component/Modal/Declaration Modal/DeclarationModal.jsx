// DeclarationModal.js
import React, { useState } from 'react';
import UploadSignatureModal from '../UploadSignatureModal/UploadSignatureModal';
import './Declaration.css';

const DeclarationModal = ({ show, onClose, onUpload ,data}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!show) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="declaration-modal-backdrop">
      <div className="declaration-modal-content">
        <button className="declaration-modal-close" onClick={onClose}>X</button>
        <h2>Terms and Conditions</h2>
        <p>

          <ul>
            <li>        I HEREBY AGREE THAT DAMAGES NOTICES DURING THIS INSPECTION SHALL BE EXCLUDED IN THE EVENT OF ANY CLAIM BEING LADGE 
</li>
            {/* <li>You will not use the service for any illegal activities.</li>
            <li>You accept that the service is provided "as-is" and without warranties of any kind.</li>
            <li>You agree to indemnify and hold harmless the service provider from any claims or damages.</li>
            <li>You understand that your use of the service is at your own risk.</li> */}
          </ul>
        </p>
        {/* <input type="file" onChange={onUpload} /> */}
        <button  onClick={handleOpenModal}>Upload Signature</button>

      </div>
      <UploadSignatureModal
        show={isModalOpen}
        onClose={handleCloseModal}
        data={data}
      />
    </div>
  );
};

export default DeclarationModal;
