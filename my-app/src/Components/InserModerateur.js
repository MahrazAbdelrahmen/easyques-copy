//insertModerateur.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserAPI from '../api/user-api';
import { UserRoles } from '../api/structures';
import { useNavigate } from 'react-router-dom';
import "../Styles/moderateurForm.css";

const ModeratorForm = ({ onClose }) => {
    
    const [userData, setUserData] = useState({
        password: '',
        email: '',
        first_name: '',
        last_name: '',
    });
    const [successMessage, setSuccessMessage] = useState(null);
    const [test, setTest] = useState("null");

    const navigator = useNavigate();
    useEffect(()=>{

        
    })
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email } = userData;

        // Vérifier si l'email contient le caractère "@"
    if (!email || !email.includes('@')) {
        alert('Veuillez saisir une adresse e-mail valide.');
        return;
      }
        try {
            await axios.post('http://localhost:8000/moderator/create/', userData);

            // Handle success or redirect
            setSuccessMessage("`${response.data.username} créé avec succès. Mot de passe: ${response.data.password}`");


        } catch (error) {
            // Handle error

            console.error('Error:', error);
        }
    };
    const handleCopyPassword = () => {
        // Copy the password to the clipboard
        const passwordInput = document.getElementById('generated-password');
        passwordInput.select();
        document.execCommand('copy');
      };
      const handleModalClose = () => {
        // Close the form and reset the success message
        onClose();
        setSuccessMessage(null);
      };
    return (
        <>
        
        <div className="overlay">
      <div className="modal">
        <div className='mod-form'>
          {successMessage ? (
            // Show success message with copy button
            <div>
              <p className='msg'>{successMessage}</p>
              <div className="form-button">
                <input
                  type="text"
                  id="generated-password"
                  value={successMessage.split(':')[1].trim()} // Extract password from the message
                  readOnly
                />
                <div className='submit-cancel'>
                  <button onClick={handleCopyPassword} className="cancel-button">Copy </button>
                  <button onClick={handleModalClose}  id="submit-button">Close </button>
                </div>
              </div>
            </div>
          ) : (
            // Show the form for user input
            <form onSubmit={handleSubmit}>

              <div className="form-button">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-button">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                />
              </div> 
              <div className="form-button">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='submit-cancel'>
                <button onClick={handleModalClose} className="cancel-button">Cancel </button>
                <button type="submit" id='submit-button'>Add</button>
              </div>
            </form>
            
          )}
        </div>
      </div>
    </div>
    
        </>
        
    );
};

export default ModeratorForm;
