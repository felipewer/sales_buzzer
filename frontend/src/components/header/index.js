import { h, Component } from 'preact';
import style from './style';

const tokenExtractionExp = RegExp('[#&]access_token=([^&]*)');

export default class Header extends Component {
	
	logout() {
		localStorage.removeItem('access_token');
		this.setState({ isLoggedIn: false });
	}
	
	constructor(props) {
		super(props);
		this.state = { isLoggedIn: false };
		this.logout = this.logout.bind(this);
	}

	componentWillMount() {
		let token = localStorage.getItem('access_token');
		if (!token && window.location.hash) {
			const match = tokenExtractionExp.exec(window.location.hash);
			token = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
			if (token) {
				localStorage.setItem('access_token', token);
				history.pushState('',
					document.title,
					window.location.pathname + window.location.search
				);
			}
		}
		this.setState({ isLoggedIn: !!token });
	}

	render() {
		const SocialLogin = (props) => (
			(props.isLoggedIn) ?
				<a onClick={this.logout}>Logout</a> :
				<a href="/auth/github" native>Github</a>
		);

		return (
			<header class={style.header}>
				<h1>Startup Buzzer</h1>
				<nav>
					<SocialLogin isLoggedIn={this.state.isLoggedIn} />
				</nav>
			</header>
		);
	}
}
