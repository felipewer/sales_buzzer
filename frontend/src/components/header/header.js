import { h } from 'preact';
import style from './style';

const Header = (props) => {
	const SocialLogin = () => (
		(props.loggedIn) ?
			<a onClick={props.logOut}>Logout</a> :
			<a href="/auth/github" native>Github</a>
	);

	return (
		<header class={style.header}>
			<h1>Startup Buzzer</h1>
			<nav>
				<SocialLogin />
			</nav>
		</header>
	);
};

export default Header;