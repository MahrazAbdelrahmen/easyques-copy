import React, { useEffect, useState } from 'react';
import ArticleAPI from '../api/article_api';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAPI from '../api/user-api';
import { UserRoles } from '../api/structures';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/admin.css";
import SearchField from "../Components/SearchField";
import Navbar_Admin from "../Components/Navbar_admin";
import EditForm from "../Components/EditForm";
import AddContainer from "../Components/AddContainer";
import ModeratorForm from "../Components/InserModerateur";

const ArticleUploader = () => {
  const navigator = useNavigate('/forbidden')
  const [url, setUrl] = useState('');
  const notify = () => toast.error();
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  const handleUpload = async () =>{
    try {
      await ArticleAPI.handleUpload(url);
      notify();
      toast.error(">--UPLOAD SUCCESS!");
    } catch (error) {
      notify();
      toast.error(">--ERROR HAPPENED  : " + error);
    }

  }
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setDisplayedUsers(filteredUsers);
  };
  const searchPlaceholder = "Search...";
  const [searchValue, setSearchValue] = useState('');
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [moderators, setModerators] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [emptyUrl, setemptyUrl] = useState(true);


  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ModerateurManager/');
        setModerators(response.data);
      } catch (error) {
        console.error('Error fetching moderators:', error);
      }
    };

    fetchModerators();
  }, []);

  const users = moderators.map((moderateur) => ({
    id: moderateur.id,
    name: moderateur.username,
    title: moderateur.email,
  }));

  useEffect(() => {
    const updatedUsers = moderators.map((moderateur) => ({
      id: moderateur.id,
      name: moderateur.username,
      title: moderateur.email,
    }));

    setDisplayedUsers(updatedUsers);
  }, [moderators]);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

 

 






  const handleEditSubmit = async (id, updatedUserData) => {
    try {
      const currentUser = moderators.find((user) => user.id === id);
      const currentPassword = currentUser ? currentUser.password : '';

      // Include the current password in the request
      const requestData = {
        ...updatedUserData,
        password: currentPassword,
      };

      // Log the data before making the request
      console.log('Updated User Data:', requestData);

      await axios.put(`http://localhost:8000/ModerateurManager/update/${id}/`, requestData);
      setEditUserId(null);
      setEditingUser(null);
      // You may want to fetch the updated list of users here
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  

  return (
    <>
     <div className="admin">
      <Navbar_Admin />

      

      <div className=' mt-10 flex justify-center  '>
      <ToastContainer theme='dark' position="bottom-center" ></ToastContainer>
      <div className='font-bold mr-5 inline'><h1 className='inline font-bold mr-5'>URL du PDF:</h1>
      <input  className="rounded-md w-96" type="text" value={url} onChange={handleUrlChange} />
      <div className='font-bold ml-5 inline hover:text-blue'><button onClick={handleUpload}>Uploader</button></div></div>
      
    </div>

      {/**Url List */}
      <div className="admin_part1">
        <div className="url-empty">
        <div className="url-empty-inside">
        <img className="img-url-empty" src="./Assets/urlEmpty.svg" alt="Url Icon" />
        <p >Upload new articles </p>
        </div>
      
      </div>
      </div>
      
    

     
      
      
    </div>
    
    </>
  );
};

export default ArticleUploader;
