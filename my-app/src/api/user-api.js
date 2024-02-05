import axios from "axios";
import apiConfig from "./apiConfig";
import TokenAPI from "./token";
class UserAPI {
    static async fetchUserData() {
        try {
            const tokenValue = await TokenAPI.getCookie('token');
            console.log("token : ", tokenValue);
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
    static async logoutUser(token) {
        try {
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
}

export default UserAPI