//Moderateur.js

import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../Styles/admin.css";
import SearchField from "../Components/SearchField";
import Navbar_Admin from "../Components/Navbar_admin";
import { UserRoles } from "../api/structures";
import UserAPI from "../api/user-api";
import { useNavigate } from "react-router-dom";
import EditForm from "../Components/EditForm";
import AddContainer from "../Components/AddContainer";
import ModeratorForm from "../Components/InserModerateur";

function Moderators(params) {
  const searchPlaceholder = "Search...";
  const navigator = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [activeButton, setActiveButton] = useState("All");
  const [editUserId, setEditUserId] = useState(null); // Track the user being edited
  const [moderators, setModerators] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [tesst, setTesst] = useState("null");

  useEffect(() => {
    const test = async () => {
      await UserAPI.testForidden(UserRoles.ADMIN, () => navigator('/forbidden'));
    }
    test();
    
    const fetchModerators = async () => {
      try {
        const response = await axios.get('http://localhost:8000/moderator/ModerateurManager/');
        setModerators(response.data);
      } catch (error) {
        console.error('Error fetching moderators:', error);
      }
    };

    fetchModerators();
  }, []);  // Remove displayedUsers from the dependency array

  const users = moderators.map((moderateur) => ({
    id: moderateur.id,
    name: moderateur.first_name + '_' + moderateur.last_name,
    title: moderateur.email,
  }));

  useEffect(() => {
    const updatedUsers = moderators.map((moderateur) => ({
      id: moderateur.id,
      name: moderateur.first_name + '_' + moderateur.last_name,
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
  const handleDeleteClick = (id) => {
    setDeletingUserId(id);
    setShowDeleteConfirmation(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/ModerateurManager/${deletingUserId}/`);
      const updatedUsers = displayedUsers.filter((user) => user.id !== deletingUserId);
      setDisplayedUsers(updatedUsers);
      setTesst("true");
    } catch (error) {
      setTesst("false");

      console.error('Error deleting user:', error);
    } finally {
      setShowDeleteConfirmation(false);
      setDeletingUserId(null);
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeletingUserId(null);
  };

  const handleFilterClick = (title) => {
    setActiveButton(title);
    const filteredUsers = title === "All" ? users : users.filter((user) => user.title === title);
    setDisplayedUsers(filteredUsers);
  };

 

  const handleShowPasswordClick = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/moderator/ModerateurManager/show-password/${id}/`);
      const { real_password, password } = response.data;
      alert(`Real Password: ${real_password}\nHashed Password: ${password}`);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const handleEditClick = (id) => {
    setEditUserId(id);
    const userToEdit = displayedUsers.find((user) => user.id === id);
    setEditingUser(userToEdit);
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

  const handleEditChange = (value, field) => {
    // Update the edited user data in the state
    const updatedUsers = displayedUsers.map((user) => {
      if (user.id === editUserId) {
        return {
          ...user,
          [field]: value,
        };
      }
      return user;
    });
    setDisplayedUsers(updatedUsers);
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(newValue.toLowerCase())
    );
    setDisplayedUsers(filteredUsers);
  };

  return (
    <div className="admin">
      <Navbar_Admin />

      {/**Search&add button */}
      <div className="admin_part1">
        <div className="search-add">
          <SearchField
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e)}
          />
          <button className="add-button" onClick={handleAddClick}>
            <div>
              <img className="add_img" src="./Assets/add.svg" alt="Add Icon" />
              <p>Add</p>
            </div>
          </button>
        </div>
      </div>

      {/**Users List */}
      <div className="admin_part1">
        <div className="user-list">
          {displayedUsers.slice().reverse().map((user) => (
            <div key={user.id} className="user-item">
              {/* First Column: User Name and Email */}
              <div className="user-info">
                <p className={`user-name ${editUserId === user.id ? 'bold-text' : ''}`}>
                  {user.name}
                </p>
                <p className="user-mail">
                  {user.title}
                </p>
              </div>

              {/* Second Column: Show Password Button */}
              <div className="user-action">
               
                  <button className="show-password-button" onClick={() => handleShowPasswordClick(user.id)}>
                    Show Password
                  </button>
                
              </div>

              {/* Third Column: Delete, Edit and Threepoint Buttons */}
              <div className="user-action">
                
                  <>
                    <button className="delete-button" onClick={() => handleDeleteClick(user.id)}>
                      <img className="delete_img" src="./Assets/trash.svg" alt="Trash Icon" />
                    </button>
                    <button className="edit-button" onClick={() => handleEditClick(user.id)}>
                      <img className="edit_img" src="./Assets/treepoint.svg" alt="Treepoint Icon" />
                    </button>
                  </>
                
              </div>

              {/* Edit Form */}
              {editingUser && editUserId === user.id && (
                <div className="edit-form">
                  {/* You can reuse the ModeratorForm or create a separate EditForm component */}
                  <EditForm
                    initialData={{ username: editingUser.name, email: editingUser.title }}
                    onClose={() => {
                      setEditingUser(null);
                      setEditUserId(null);
                    }}
                    onSubmit={(updatedData) => handleEditSubmit(user.id, updatedData)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/** Add Container */}
      
      {showAddModal && <div className="overlay">
      <div className="modal">
        
      <ModeratorForm onClose={handleCloseAddModal} />
      </div>
    </div>}

      {/** Delete Confirmation Modal */}
      
      
      
      {showDeleteConfirmation && <div className="overlay">
      <div className="modal">
      <div className="confirmation-modal">
        <p className="text-blue">{tesst}</p>
        <div><p className='delete-msg'>Are you sure you want to delete it?</p></div>
        
        <div className="confirmation-buttons">
          
          <button className="delete-yes"onClick={handleConfirmDelete}>Delete</button>
          <button className="delete-no" onClick={handleCancelDelete}>Cancel</button>
        </div>
      </div> 
        
      </div>
      </div>
      }
      
      
    </div>
  );
}

export default Moderators;
