// src/components/AddContainer.js
import React from 'react';
import "../Styles/moderateurForm.css";

function AddContainer({ onClose, children }) {
  return (
    <div className="overlay">
      <div className="modal">
        
        {children}
      </div>
    </div>
  );
}

export default AddContainer;
