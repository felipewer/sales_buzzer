import axios from 'axios';
import { getAccessToken } from './auth';

const headers = () => ({ Authorization: `Bearer ${getAccessToken()}` });
    
const listSounds = () =>
	axios.get('/api/sounds', { headers: headers() })
		.then(response => response.data)
		.catch(err => {
			// TODO Give some visual feedback
			console.error(err);
			return [];
		});
    
    
export default {
	listSounds
};