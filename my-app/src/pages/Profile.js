import React from "react";
import Navbar from "../Components/Navbar";
import Profile_compo from "../Components/Profile_compo";
import UserAPI from "../api/user-api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserRoles } from "../api/structures";
function Profile() {
  const navigator = useNavigate();
  useEffect(() => {
    const test = async () => {
      await UserAPI.testNonForidden(UserRoles.MODERATOR, () => navigator('/forbidden'));
      await UserAPI.nonUserTypeTest(() => navigator('/forbidden'));
    }
    test();
  })
  
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
