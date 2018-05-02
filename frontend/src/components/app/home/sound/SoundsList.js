import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faMusic from '@fortawesome/fontawesome-free-solid/faMusic'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

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
			<table class="table is-striped is-hoverable is-fullwidth">
				<tbody>
					{props.sounds.map(sound => (
						<tr>
							<td>
								{sound}
							</td>
							<td class="has-text-right" style="width: 30px;">
								<button
									class="button is-primary is-small" 
									value={sound} 
									onClick={this.play}>
									<span class="icon">
										<FontAwesomeIcon icon={faPlay} />
									</span>
								</button>
							</td>
							<td class="has-text-right" style="width: 30px;">
								<button class="button is-small"
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
  	);
  }
}