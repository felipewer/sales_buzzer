import { h } from 'preact';

const Header = (props) => (
	<header>
		<img src="/assets/icons/logo.png" width="35" height="35" />
		<button id="logout" onClick={props.logOut}>Logout</button>
	</header>
);

export default Header;