import React from "react";
import { Success } from "../Constant/ImageConstant";
import "./CommonModal.css";

const CommonModal = ({ isOpen, onClose, message, type }) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <div className={`modal1 ${isOpen ? "open" : "closed"}`}>
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <div className={`modal-body ${type}`}>
          {type === "success" ? (
            <img src={Success} alt="Success" className="icon" />
          ) : (
            <img src="error-icon.png" alt="Error" className="icon" />
          )}
          <p>{message}</p>
          <button onClick={closeModal}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
