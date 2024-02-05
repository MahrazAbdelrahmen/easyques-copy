import React from "react";
import Navbar from "../Components/Navbar";
import Profile_compo from "../Components/Profile_compo";
import UserAPI from "../api/user-api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar_Admin from "../Components/Navbar_admin";
function ProfileAdmin() {
  const navigator = useNavigate();
  
  
  return (
    <div className="profile">
      <Navbar_Admin></Navbar_Admin>

      <div className="w-screen h-screen  flex items-center justify-center">

        <Profile_compo></Profile_compo>
      </div>

    </div>
  );
}
export default ProfileAdmin;
