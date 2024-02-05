import React from "react";
import "../Styles/ProfileComponent.css";
import "../Styles/Login.css";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserAPI from "../api/user-api";
import { faDoorOpen, faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Profile_compo() {

  const navigator = useNavigate();
  const notify = () => toast.error();
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditingFull, setIsEditingFull] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,

  });


  const [originalUserData, setOriginalUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    password: '',
    currentPass: '',
  });

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await UserAPI.fetchUserData();

        setOriginalUserData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          type: data.type,
        });

        setUserData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          type: data.type,
        });
        setLoading(false);
      } catch (error) {
        notify();
        toast.error(error);
      }
    };

    getData();
  }, []);

  const handleEditClick = (field) => {
    setIsEditingFull({ ...isEditingFull, [field]: !isEditingFull[field] });
    if (field == 'password') {
      setShowPasswordModal(true);
    }
  };
  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };
  const handlePasswordUpdate = async () => {
    try {
      await UserAPI.updatePassword(currentPassword, newPassword);

      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  if (loading) {
    return null;
  }
  const handleSaveClick = async () => {
    console.log(userData.email, originalUserData.email)
    try {
      
      if (userData.email !== originalUserData.email) {
        console.log("ggg",userData.email)
        await UserAPI.updateUsername(userData.email);
      }

      setIsEditingFull({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
      });

      toast.success("Changes saved successfully!");
    } catch (error) {
      notify();
      toast.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await UserAPI.logoutUser();
      navigator("/");
      notify();
      toast.success("Logout Success!");
    } catch (error) {
      notify();
      toast.error(error);
    }
  };
  return (
    <div className="profile_Compo relative rounded-3xl md:w-[70vw] lg:w-[55vw]   w-[90vw]  h-[70vh]  grid justify-items-center content-center">
      <div className="profile-co absolute rounded-3xl w-full bottom-0 h-5/6 lg:h-[60vh] "></div>
      <div className="profile absolute bottom-12 lg:h-[60vh] h-5/6 ">
        <ToastContainer></ToastContainer>
        <div className="pro-top  flex items-end justify-start w-full h-2/5 mb-10 ml-5 md:ml-0">
          <img className="user-pic" src="./Assets/user.png" alt="" />
          <div className="pro-nom grid content-center ml-10 ">
            {" "}
            <h1
              className=" font-bold"
            >
              {userData.firstName ? userData.firstName : "Loading"}
            </h1>
            <h2>{userData.type ? userData.type : "Loading"}</h2>
          </div>
        </div>
        <div className="pro-bottom grid content-center justify-items-center ">
          <hr className="border-t border-darkgrey md:w-[550px] w-[90%]" />
          <div className="ligne h-10 w-5/6 flex items-center justify-center ligne-username ">
            <label htmlFor="username " className="text-lg md:text-xl ml-2">
              LastName{" "}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              defaultValue={userData.lastName ? userData.lastName : "Loading..."}
              readOnly={!isEditingFull.lastName}
            />
            <button
              onClick={() => handleEditClick("lastName")}
              className="text-lg md:text-xl mr-4"
            >
              Edit
            </button>

          </div>
          <hr className="border-t border-darkgrey md:w-[550px] w-[90%]" />
          <div className="ligne h-10 w-5/6 flex items-center justify-center ligne-username ">
            <label htmlFor="username " className="text-lg md:text-xl ml-2">
              FirstName{" "}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              defaultValue={userData.firstName ? userData.firstName : "Loading..."}
              readOnly={!isEditingFull.firstName}
            />
            <button
              onClick={() => handleEditClick("firstName")}
              className="text-lg md:text-xl mr-4"
            >
              Edit
            </button>
          </div>
          <hr className="border-t border-darkgrey md:w-[550px] w-[90%]" />
          <div className="ligne h-10 w-5/6 flex items-center justify-center ligne-username ">
            {" "}
            <label htmlFor="username " className="text-lg md:text-xl ml-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              defaultValue={userData.email ? userData.email : "Loading..."}
              readOnly={!isEditingFull.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <button
              onClick={() => handleEditClick("email")}
              className="text-lg md:text-xl mr-4"
            >
              Edit
            </button>
          </div>
          <hr className="border-t border-darkgrey md:w-[550px] w-[90%]" />
          <div className="ligne h-10 w-5/6 flex items-center justify-center ligne-username ">
            {" "}
            <label htmlFor="username " className="text-lg md:text-xl ml-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              readOnly={!isEditingFull.password}
            />
          </div>
          <hr className="border-t border-darkgrey md:w-[550px] w-[90%] items-center" />
          <div className="logout">
        <div className="flex items-center">

         <button onClick={async () => { await handleLogout(); navigator('/') }} className="mt-3 mr-3">
          <FontAwesomeIcon className="logout-icon" icon={faDoorOpen} alt="Logout" />
          <p className="ml-2">Logout</p>
         </button>

         <button onClick={async () => { await handleSaveClick(); alert("You must Log Back In"); navigator("/login") }} className="mt-3 ">
          <FontAwesomeIcon className="Save-icon" icon={faSave} alt="Save"  />
          <p className="ml-2">Save</p>
         </button>
        </div>
       </div>
        </div>
   


      </div>{" "}
    </div>
  );
}

export default Profile_compo;
