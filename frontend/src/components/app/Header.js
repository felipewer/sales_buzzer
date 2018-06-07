import { h, Component } from 'preact';

export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = { menuActive: false };
		this.toogleMenu = this.toogleMenu.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	logOut() {
		this.props.logOut();
		this.setState({ menuActive: false });
	}

	toogleMenu() {
		this.setState({ menuActive: !this.state.menuActive });
	}

	render(props, state) {
		const isActive = (state.menuActive) ? 'is-active' : '';
		return (
			<header>
				<nav class="navbar is-primary" role="navigation">
					<div class="navbar-brand">
						<a class="navbar-item" href="/">
							<figure class="image is-24x24">
								<img alt="Startup Buzzer" src="/assets/icons/logo.png" />
							</figure>
							<p class="subtitle">&nbsp;Startup Buzzer</p>
						</a>
						<a class={`navbar-burger ${isActive}`}
							role="button"
							onClick={this.toogleMenu}
							aria-label="menu"
							aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					{ props.loggedIn && (
						<div class={`navbar-menu ${isActive}`}>
							<div class="navbar-end">
								<a class="navbar-item"
									onClick={this.logOut}>
									Logout
								</a>
							</div>
						</div>
					)}
				</nav>
			</header>
		);
	}
}
