import React from "react";
import "../Styles/ProfileComponent.css";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UserAPI from "../api/user-api";


function Profile_compo() {

  const [isEditingFull, setIsEditingFull] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });



  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type:"",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await UserAPI.fetchUserData();
        setUserData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          type:data.type,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const handleEditClick = (field) => {
    setIsEditingFull({ ...isEditingFull, [field]: !isEditingFull[field] });
  };

  if (loading) {
    return null;
  }

  const handleLogout = () => {
    console.log("Bouton de déconnexion cliqué");
    window.location.href = "/";
  };
  return (
    <div className="profile_Compo relative rounded-3xl md:w-[70vw] lg:w-[55vw]   w-[90vw]  h-[80vh] mt-10 grid justify-items-center content-center">
      <div className="profile-co absolute rounded-3xl w-full bottom-0 h-5/6 lg:h-[60vh] "></div>
      <div className="profile absolute bottom-12 lg:h-[60vh] h-5/6 ">
        <div className="pro-top  flex items-end justify-start w-full h-2/5 mb-10 ml-5 md:ml-0">
          <img className="user-pic" src="./Assets/user.png" alt="" />
          <div className="pro-nom grid content-center ml-10 ">
            {" "}
            <h1
              className="
            "
            >
              {userData.firstName ? userData.firstName : "Loading"}
            </h1>
            <h2>{userData.type?userData.type:"Loading"}</h2>
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
            />
            <button
              onClick={handleEditClick}
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
            <button
              onClick={() => handleEditClick("password")}
              className="text-lg md:text-xl mr-4"
            >
              Edit
            </button>
          </div>
        </div>
        <hr className="border-t border-darkgrey md:w-[550px] w-[90%]" />
        <NavLink to="/">
          {" "}
          <div className="logout">
            <button onClick={handleLogout} className="mt-10">
              onClick{
                () => {

                }
              }
              <img
                className="logout-icon"
                src="./Assets/logout.png"
                alt="Logout"
              />
              <p>Logout</p>
            </button>
          </div>
        </NavLink>
      </div>{" "}
    </div>
  );
}

export default Profile_compo;
