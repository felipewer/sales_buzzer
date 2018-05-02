import { h, Component } from 'preact';
import linkState from 'linkstate';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBullhorn from '@fortawesome/fontawesome-free-solid/faBullhorn'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'

export default class Speak extends Component {

	handleSubmit = e => {
    e.preventDefault();
    this.props.onSpeak(this.state.speech);
    this.setState({ speech: null });
	}

  constructor(props) {
  	super(props);
  	this.state = { speech: null };
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(props, state) {
  	return (
      <form onSubmit={this.handleSubmit}>
        <div class="field has-addons">
          <div class="control has-icons-left is-expanded">
            <input type="text"
              class="input"
              placeholder="Say something..."
              value={state.speech}
              onChange={linkState(this, 'speech')}
              required />
            <span class="icon is-small is-left">
              <FontAwesomeIcon icon={faBullhorn} />
            </span>
          </div>
          <div class="control">
            <button class="button is-primary" type="submit">
              <span class="icon">
                <FontAwesomeIcon icon={faPlay} />
              </span>
            </button>
          </div>
        </div>
      </form>
    );
  }
}