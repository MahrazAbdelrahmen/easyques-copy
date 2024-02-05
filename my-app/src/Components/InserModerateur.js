import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserAPI from '../api/user-api';
import { UserRoles } from '../api/structures';
import { useNavigate } from 'react-router-dom';
const ModeratorForm = () => {
    
    const [userData, setUserData] = useState({
        password: '',
        email: '',
        first_name: '',
        last_name: '',
    });
   
    const navigator = useNavigate();
    useEffect(()=>{

        const test = async () => {
            await UserAPI.testForidden(UserRoles.ADMIN, () => navigator('/forbidden'));
          }
          test();
    })
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/moderator/create/', userData);
            // Handle success or redirect
        } catch (error) {
            // Handle error
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>First Name: </label>
            <input type="text" name="first_name" onChange={handleChange} required />
            <label>Last Name: </label>
            <input type="text" name="last_name" onChange={handleChange} required />

            <label>Email: </label>
            <input type="email" name="email" onChange={handleChange} required />

            <button type="submit">Submit</button>
        </form>
    );
};

export default ModeratorForm;
