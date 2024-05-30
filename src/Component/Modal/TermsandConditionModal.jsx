// TermsModal.js
import React from 'react';
import Modal from 'react-modal';

const TermsModal = ({ isOpen, onRequestClose, onApprove }) => (
  <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <h2>Terms and Conditions</h2>
    <p>Here are the terms and conditions...</p>
    <button onClick={onApprove}>Approve</button>
    <button onClick={onRequestClose}>Close</button>
  </Modal>
);

export default TermsModal;
