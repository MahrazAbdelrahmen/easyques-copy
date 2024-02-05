import React from "react";
import Navbar from "../Components/Navbar";
import Profile_compo from "../Components/Profile_compo";
import { useEffect, useState } from "react";
import UserAPI  from "../api/user-api";
function Profile() {
    

  return (
    <div className="profile">
      <Navbar></Navbar>

      <div className="w-screen h-screen  flex items-center justify-center">

        <Profile_compo></Profile_compo>
      </div>

    </div>
  );
}
export default Profile;
