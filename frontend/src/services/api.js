import { get, post, delete as del } from 'axios';
import { getAccessToken } from './auth';
import emitter from './event_emitter';


const headers = () => ({ Authorization: `Bearer ${getAccessToken()}` });
		
const unauthorized = err => {
	if (err.response && err.response.status === 401){
		emitter.emit('UNAUTHORIZED');
	}
	throw err;
}

export const addSound = (sound, url) =>
	post('/api/sounds',
		{ sound, url },
		{ headers: headers() }
	).catch(unauthorized);

export const listSounds = () =>
	get('/api/sounds', { headers: headers() })
		.then(response => response.data)
		.catch(unauthorized);
		
export const playSound = (sound) =>
	get(`/api/sounds/${sound}`, { headers: headers() })
		.catch(unauthorized);

export const removeSound = (sound) =>
	del(`/api/sounds/${sound}`, { headers: headers() })
		.catch(unauthorized);

export const speak = (speech) =>
	post('/api/speech',
		{ speech },
		{ headers: headers() }
	).catch(unauthorized);
