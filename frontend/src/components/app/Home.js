import { h, Component } from 'preact';
import emitter from '../../services/event_emitter';
import AddSound from './home/sound/AddSound';
import SoundsList from './home/sound/SoundsList';
import Speak from './home/speech/Speak';
import {
	addSound,
	listSounds,
	playSound,
	removeSound,
	speak
} from '../../services/api';


export default class Home extends Component {

	constructor(props) {
  	super(props);
		this.state = { sounds: [] };
  	this.handleAddSound = this.handleAddSound.bind(this);
  	this.handlePlaySound = this.handlePlaySound.bind(this);
  	this.handleRemove = this.handleRemove.bind(this);
  	this.handleSpeak = this.handleSpeak.bind(this);
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

	render(props, state) {
		return (
			<article id="home">
				<section id="speak">
					<Speak onSpeak={this.handleSpeak} />
				</section>
				<section id="add-sound">
					<AddSound onAddSound={this.handleAddSound} />
				</section>
				<section id="sound-list">
					<SoundsList sounds={state.sounds}
						play={this.handlePlaySound}
						remove={this.handleRemove} />
				</section>
			</article>
		);
	};
};
