import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import Header from './header/header';
import Home from '../routes/home/home';
// import Home from 'async!../routes/home';
import auth from './auth';

if (module.hot) {
	require('preact/debug');
}

const prerendering = (typeof window === 'undefined');

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		// Check if not Pre-rendering
		if (!prerendering && e.url === '/') {
			let loggedIn = auth.isLoggedIn();
			if (!loggedIn) {
				const accessToken = auth.extractAccessToken(window.location.hash);
				if (accessToken) {
					auth.logIn(accessToken);
					loggedIn = true;
				}
			}
			this.setState({ loggedIn });
			route('/', true);
		}
	};
	
	logOut() {
		auth.logOut();
		this.setState({ loggedIn: false });
	}
	
	constructor(props) {
		super(props);
		this.state = { loggedIn: false };
		this.handleRoute = this.handleRoute.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	render() {
		return (
			<div id="app">
				<Header loggedIn={this.state.loggedIn} logOut={this.logOut} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
				</Router>
			</div>
		);
	}
}
