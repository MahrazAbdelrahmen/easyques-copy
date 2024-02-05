// src/components/EditForm.js
import React, { useState } from 'react';
import "../Styles/moderateurForm.css";

const EditForm = ({ initialData, onClose, onSubmit }) => {
  const [editData, setEditData] = useState(initialData);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editData);
    window.location.reload();
    onClose();


  };

  return (
    <div className='overlay'>
          <div className='modal'>

    <form onSubmit={handleSubmit}>
      <div className="form-button">
        <label>Name:</label>
        <input
          type="text"
          name="username"
          value={editData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-button">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={editData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className='submit-cancel'>
        <button onClick={onClose} className="cancel-button">Cancel</button>
        <button type="submit" id='submit-button'>Submit</button>
      </div>
    </form>
    </div>
    </div>

  );
};

export default EditForm;