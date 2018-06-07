import { h, Component } from 'preact';
import emitter from '../../services/event_emitter';
import AddSound from './home/sound/AddSound';
import SoundsList from './home/sound/SoundsList';
import Speak from './home/speech/Speak';
import GenerateToken from './home/token/GenerateToken';
import {
	addSound,
	listSounds,
	playSound,
	removeSound,
	speak,
	generateToken
} from '../../services/api';


export default class Home extends Component {

	constructor(props) {
  	super(props);
		this.state = { sounds: [] };
  	this.handleAddSound = this.handleAddSound.bind(this);
  	this.handlePlaySound = this.handlePlaySound.bind(this);
  	this.handleRemove = this.handleRemove.bind(this);
  	this.handleSpeak = this.handleSpeak.bind(this);
  	this.handleGenerateToken = this.handleGenerateToken.bind(this);
  }

	componentDidMount(){
		listSounds()
			.then(sounds => this.setState({ sounds }))
			.catch(error => {
				emitter.emit('DISPLAY_ERROR', 'Could not load sounds');
			});
				
	}

	handleAddSound(sound, url) {
		addSound(sound, url)
			.then(() => listSounds())
			.then(sounds => this.setState({ sounds }))
			.catch(error => {
				emitter.emit('DISPLAY_ERROR', 'Could not add sound');
			});
	}

	handlePlaySound(sound) {
		playSound(sound)
			.catch(error => {
				emitter.emit('DISPLAY_ERROR', 'Could not play sound');
			});
	}

  handleRemove(sound) {
		removeSound(sound)
			.then(() => listSounds())
			.then(sounds => this.setState({ sounds }))
			.catch(error => {
				emitter.emit('DISPLAY_ERROR', 'Could not remove sound');
			});
	}

	handleSpeak(speech) {
		speak(speech)
			.catch(error => {
				emitter.emit('DISPLAY_ERROR', 'Could not utter speech');
			});
	}

	handleGenerateToken() {
		return generateToken()
			.then(token => {
				emitter.emit('DISPLAY_MESSAGE', `API Token: ${token}`)
			})
			.catch(error => {
				emitter.emit('DISPLAY_ERROR', 'Could not generate API token');
			});
	}

	render(props, state) {
		return (
			<article>
				<section class="section">
					<div class="container">
						<div class="box">
							<h1 class="subtitle has-text-centered">API Token</h1>
							<GenerateToken onGenerate={this.handleGenerateToken} />
						</div>
					</div>
				</section>
				<section class="section">
					<div class="container">
						<div class="box">
							<h1 class="subtitle has-text-centered">Speech</h1>
							<Speak onSpeak={this.handleSpeak} />
						</div>
					</div>
				</section>
				<section class="section">
					<div class="container">
						<div class="box">
							<h1 class="subtitle has-text-centered">Sounds</h1>
							<AddSound onAddSound={this.handleAddSound} />
							<hr />
							<SoundsList sounds={state.sounds}
								play={this.handlePlaySound}
								remove={this.handleRemove} />
						</div>
					</div>
				</section>
			</article>
		);
	};
};
