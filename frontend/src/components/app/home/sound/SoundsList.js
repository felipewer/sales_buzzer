import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faMusic from '@fortawesome/fontawesome-free-solid/faMusic';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import emitter from '../../../../services/event_emitter';

export default class SoundsList extends Component {

  play = e => this.props.play(e.currentTarget.value);

	remove = e => this.props.remove(e.currentTarget.value);
	
	showAddress = e => {
		const url = `${window.location.origin}/api/sounds/${e.currentTarget.value}`;
		emitter.emit('DISPLAY_MESSAGE', url);
	}

  constructor(props) {
		super(props);
		this.state = { soundAddress: null}
  	this.play = this.play.bind(this);
  	this.remove = this.remove.bind(this);
  	this.showAddress = this.showAddress.bind(this);
  }

  render(props) {
  	return (
			<div>
				<table class="table is-striped is-hoverable is-fullwidth">
					<tbody>
						{props.sounds.map(sound => (
							<tr>
								<td>
									{sound}
								</td>
								<td class="has-text-right" style="width: 30px;">
									<button
										class="button is-secondary is-small" 
										value={sound} 
										onClick={this.play}>
										<span class="icon">
											<FontAwesomeIcon icon={faPlay} />
										</span>
									</button>
								</td>
								<td class="has-text-right" style="width: 30px;">
									<button class="button is-info is-small"
										value={sound} 
										onClick={this.showAddress}>
										<span class="icon">
											<FontAwesomeIcon icon={faLink} />
										</span>
									</button>
								</td>
								<td class="has-text-right" style="width: 30px;">
									<button class="button is-danger is-small"
										value={sound} 
										onClick={this.remove}>
										<span class="icon">
											<FontAwesomeIcon icon={faTrashAlt} />
										</span>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
  	);
  }
}