import { h, Component } from 'preact';

export default class SoundsList extends Component {

  play = e => this.props.play(e.currentTarget.value);

  remove = e => this.props.remove(e.currentTarget.value);

  constructor(props) {
  	super(props);
  	this.play = this.play.bind(this);
  	this.remove = this.remove.bind(this);
  }

  render(props) {
  	return (
  		<table>
  			{props.sounds.map(sound => (
  				<tr>
  					<td>{sound}</td>
  					<td>
  						<button value={sound} onClick={this.play}>Play</button>
  					</td>
  					<td>
  						<button value={sound} onClick={this.remove}>X</button>
  					</td>
  				</tr>
  			))}
  		</table>
  	);
  }
}