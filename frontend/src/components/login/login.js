import { h } from 'preact';

const Login = (props) => (
	<article id="login">
		<h1>Login</h1>
		<section id="github">
			<img src="/assets/icons/github.png" width="80" height="80" />
			<a href="/auth/github" native>Github</a>
		</section>
	</article>
);

export default Login;