



class MoeratorAPI {
    static async fetchModerators() {
        try {
            const response = await axios.get('http://localhost:8000/ReadModerateurs'); // Update the URL with your API endpoint
            return 
        } catch (error) {
            console.error('Error fetching moderators:', error);
        }
    }
}
