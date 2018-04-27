const extractAccessToken = (locationHash) => {
	const match = RegExp(/[#&]access_token=([^&]*)/).exec(locationHash);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

const getAccessToken = () => localStorage.getItem('access_token');

const isLoggedIn = () => !!localStorage.getItem('access_token');

const logIn = (accessToken) => {
	localStorage.setItem('access_token', accessToken);
};

const logOut = () => localStorage.removeItem('access_token');

module.exports = {
	extractAccessToken,
	getAccessToken,
	isLoggedIn,
	logIn,
	logOut
};