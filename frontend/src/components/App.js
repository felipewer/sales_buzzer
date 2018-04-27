import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import Match from 'preact-router/match';

import emitter from '../services/event_emitter';
import Header from './app/Header';
import Home from './app/Home';
import Login from './app/Login';
import Message from './app/Message';

// import Home from 'async!./home/home';
import auth from '../services/auth';

if (module.hot) {
	require('preact/debug');
}

const prerendering = (typeof window === 'undefined');

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = { loggedIn: false };
		this.handleRoute = this.handleRoute.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	componentDidMount() {
		emitter.on('UNAUTHORIZED', this.logOut);
	}

	componentWillUnmount() {
		emitter.off('UNAUTHORIZED', this.logOut);
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = event => {
		// Check if not Pre-rendering
		if (!prerendering && event.url === '/') {
			const loggedIn = auth.isLoggedIn();
			if (loggedIn) {
				if (!this.state.loggedIn) this.setState({ loggedIn: true });
			} else {
				const accessToken = auth.extractAccessToken(window.location.hash);
				if (accessToken) {
					auth.logIn(accessToken);
					this.setState({ loggedIn: true });
					route('/', true);
				} else {
					route('/login', true);
				}
			}
		}
	};
	
	logOut() {
		auth.logOut();
		route('/login', true);
	}
	
	render(props, state) {
		return (
			<div id="app">
				<Header loggedIn={state.loggedIn} logOut={this.logOut} />
				<Router onChange={this.handleRoute}>
					<Match path="/">
						{ ({ matches }) => matches && state.loggedIn && (
							<Home />
						) }
					</Match>
					<Login path="/login" />
				</Router>
				<Message duration="4000" />
			</div>
		);
	}
}
