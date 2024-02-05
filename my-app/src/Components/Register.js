import React, { useState } from "react";
import "../Styles/Login.css";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';

import "react-toastify/dist/ReactToastify.css";
import MyInput from "./MyInput";
function Register() {
  const [EmailVal, setEmailVal] = useState();
  const [PassVal, setPassVal] = useState();
  const [ConfirmVal, setConfirmVal] = useState();
  const [LastVal, setLastVal] = useState();
  const [FirstVal, setFirstVal] = useState();
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [lastError, setLastError] = useState("");
  const [firstError, setFirstError] = useState("");
  const notify = () => toast.error();
  
  const signUp=async()=> {
  
  var firstName = "document.getElementById('first').value";
  var lastName = "document.getElementById('last').value";
  var email = "document.getElementById('emil2').value";
  var password = "document.getElementById('pwd2').value";
  var firstName = document.getElementById('first').value;
  var lastName = document.getElementById('last').value;
  var email = document.getElementById('emil2').value;
  var password = document.getElementById('pwd2').value;

  await fetch('http://127.0.0.1:8000/api/sign-up/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password
      })
  })
  .then(response => {
      return response.json();
  })
  .then(data => {
    if(data.error){
      
      // afficher le message dans le cas au il y a une erreur dans les informations qui sont envoyer (manque des informations /email deja existe ..)
      notify(); toast.error(data.error);
      
    }else{
      
      alert(data.message);
      }
       
  })
  .catch(error => {
    
      console.error('Error:', error);
  });
}

const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await signUp();
      // If signUp is successful, navigate to ./Home
      navigate('/login');
    } catch (error) {
      // Handle errors
      console.error('Error happened:', error);
      // Notify user about the error
      // Assuming you have a `notify` function
      notify();
      toast.error('ERROR HAPPENED: ' + error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!FirstVal) {
      setFirstError("Veuillez remplir le champ Prénom");
    } else {
      setFirstError("");
    }
    if (FirstVal && LastVal && EmailVal && PassVal && ConfirmVal) {
      // Effectuez l'action que vous souhaitez ici
    }
  };

  return (

    <div className="login  m-w-[100vw] m-h-[90vh] truncate grid content-center justify-items-center ">
      <div className="login-container flex items-center justify-center h-[80vh] sm:w-3/5 md:w-2/5 w-4/5 rounded-2xl my-8 ">
      <div className="left-login grid content-start justify-items-center rounded-3xl text-black bg-lightgrey h-full m-2xl w-full outline-0">
        <ToastContainer></ToastContainer>
          <form
            className="text-black grid content-center justify-items-center grid-cols-1  w-full h-full"
            onSubmit={handleSubmit}
          >
            <div className="mt-10"></div>
            {/** First name  */}
            <MyInput labelText={'First name'} 
            onChange={(e) => { setFirstVal(e.target.value); setFirstError(""); }}
            placeholder={"Enter your first name"}
            id={'first'}
            value={FirstVal}
            type={'name'}
            ></MyInput>

            {firstError && <p className="text-red-500">{firstError}</p>}

            {/** Last name  */}
           <MyInput labelText={'Last name'} 
            onChange={(e) => {setLastVal(e.target.value); }}
            placeholder={"Enter your last name"}
            id={'last'}
            value={LastVal}
            type={'name'}
            ></MyInput>
         
            {/** Email   */}
           <MyInput labelText={'Email'} 
             onChange={(e) => { setEmailVal(e.target.value);}}
            placeholder={"Enter your email"}
            id={'emil2'}
            value={EmailVal}
            type={'email'}
            ></MyInput>
            
            {/** Password   */}
            <MyInput labelText={'Password'} 
            onChange={(e) => {setPassVal(e.target.value);}}
            placeholder={"Enter your Password"}
            id={'pwd2'}
            value={PassVal}
            type={'password'}
            ></MyInput>
            
            {/** Confirm password   */}
            <MyInput labelText={'Confirm Password'} 
            onChange={(e) => {setConfirmVal(e.target.value);}}
            placeholder={"Enter your Password"}
            id={'conf'}
            value={ConfirmVal}
            type={'password'}
            ></MyInput>
            



            <div className="grid content-center justify-items-center w-full h-20">
             
             {/** Sign up Button */}
            <button
              onClick={handleSignUp}
              type="submit"
              id="sub_button"
              className="login-button bg-grey px-[8rem] py-[0.5rem] cursor-pointer"
             >Sign up
            </button>
            
            </div>
          </form>

          <div className="login-footer mt-0">
            <p className="text-grey">You already have an account? </p>

            <NavLink to="/Login">
              <a href="" className="">
                <p className=" text-center text-blue underline font-bold ">
                  Login here.
                </p>
              </a>
            </NavLink>
          </div>

     </div>
        
      </div>
    </div>
  );
}

export default Register;