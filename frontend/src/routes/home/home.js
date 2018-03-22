import { h, Component } from 'preact';
import style from './style';
import api from '../../components/api';

export default class Home extends Component {

	state = { sounds: [] };

	componentDidMount(){
		api.listSounds().then(sounds => {
			this.setState({ sounds });
		});
	}
	render(props, state){
		const SoundList = () => {
			const names = state.sounds.map(sound => <li>{sound}</li>);
			return (<ul>{names}</ul>);
		};
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<SoundList />
			</div>
		);
	}
}
