import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state = { logginIn: false };
		this.toogleLogginIn = this.toogleLogginIn.bind(this);
	}

	toogleLogginIn() {
		this.setState({ logginIn: !this.state.logginIn });
	}

	render(props, state) {
		const isLoading = (state.logginIn) ? 'is-loading' : '';
		return(
			<section class="section">
				<div class="columns">
					<div class="column is-half is-offset-one-quarter">
						<div class="box">
							<h1 class="subtitle has-text-centered">Sign in</h1>
							<a href="/auth/github" native
								class={`button is-large is-dark is-flex ${isLoading}`}
								onClick={this.toogleLogginIn}>
								<span class="icon">
									<FontAwesomeIcon icon={faGithub} />
								</span>
								<span>GitHub</span>
							</a>
						</div>
					</div>
				</div>
			</section>
		);
	}
}