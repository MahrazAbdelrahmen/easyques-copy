// src/components/ConfirmationModal.js
import React from 'react';
import "../Styles/moderateurForm.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <div className="overlay">
    <div className="modal">
    <div className="confirmation-modal">
    <p>{message}</p>
    <div className="confirmation-buttons">
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  </div>
    
    </div>
  </div>
  
);

export default ConfirmationModal;
