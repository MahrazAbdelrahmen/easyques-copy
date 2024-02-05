import axios from "axios";
import apiConfig from "./apiConfig";
import TokenAPI from "./token";
import { UserRoles } from "./structures";

class UserAPI {
    static async fetchUserData() {
        try {
            const tokenValue = await TokenAPI.getCookie('token');
            const apiUrl = `${apiConfig.baseUrl}${apiConfig.getUserDataEndpoint}`;
            const headers = {
                'Authorization': `Token ${tokenValue}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(apiUrl, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    static async logoutUser() {
        try {
            const token = TokenAPI.getCookie('token');
            const apiUrl = `${apiConfig.baseUrl}${apiConfig.logoutEndPoint}`;
            const response = await axios.post(apiUrl, {}, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw Error('Error logging out:', error)
        }
    }
    static async updateUsername(newUsername) {
        try {
            const tokenValue = await TokenAPI.getCookie('token');

            const apiUrl = `${apiConfig.baseUrl}${apiConfig.changeUserNameEndPoint}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${tokenValue}`
                },
                body: JSON.stringify({
                    new_username: newUsername
                })
            });

            const data = await response.json();

            return data;

        } catch (error) {
            console.error('Error:', error);

            document.getElementById('error-message').innerText = 'Error updating username';
        }
    }
    static async checkUserType() {
        const tokenValue = await TokenAPI.getCookie('token');



        const apiUrl = `${apiConfig.baseUrl}${apiConfig.checkUserTypeEndPoint}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${tokenValue}`,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
            
            const { value } = data;
            let roleCode;

            switch (value) {
                case 1:
                    roleCode = UserRoles.USER;
                    break;

                case 2:
                    roleCode = UserRoles.MODERATOR;
                    break;

                case 3:
                    roleCode = UserRoles.ADMIN
                    console.log("hefbhebf : ", 3)
                    break;

                default:
                    roleCode = UserRoles.OTHER;
            }

            return roleCode;
        } else {
            console.log('Error:', response.status);
        }
    }
    static async testForidden(role, func) {

        const data = await UserAPI.checkUserType();

        if (data != role) {
            func();
        }
        return;
    }
    static async nonUserTypeTest(func) {
        const tokenValue = await TokenAPI.getCookie('token');
        console.log(tokenValue == null)
        if (tokenValue === null) {
            func();
        }

        return;
    }

    static async updatePassword(currentPassword, newPassword) {
        try {
            const tokenValue = TokenAPI.getCookie('token');
            const apiUrl = 'http://127.0.0.1:8000/api/update-password/';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${tokenValue}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();
            console.log(data); // Log the success message
            alert(data.message); // Display success message to the user
        } catch (error) {
            console.error('Error:', error);
            // Display error message or handle it as needed
        }
    };


}

export default UserAPI