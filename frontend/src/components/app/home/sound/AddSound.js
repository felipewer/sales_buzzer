import { h, Component } from 'preact';
import linkState from 'linkstate';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faMusic from '@fortawesome/fontawesome-free-solid/faMusic'
import faLocationArrow from '@fortawesome/fontawesome-free-solid/faLocationArrow'

export default class AddSound extends Component {

	handleSubmit = e => {
    e.preventDefault();
    this.props.onAddSound(this.state.sound, this.state.url);
    this.setState({ sound: null, url: null });
	}

  constructor(props) {
  	super(props);
  	this.state = { sound: null, url: null };
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(props, state) {
  	return (
      <form onSubmit={this.handleSubmit}>
        <div class="field">
          <div class="control has-icons-left">
            <input type="text"
              class="input"
              placeholder="Name"
              value={state.sound}
              onChange={linkState(this, 'sound')}
              required />
            <span class="icon is-small is-left">
              <FontAwesomeIcon icon={faMusic} />
            </span>
          </div>
        </div>
        <div class="field">
          <div class="control has-icons-left is-expanded">
            <input type="url"
              class="input"
              placeholder="File URL"
              value={state.url}
              onChange={linkState(this, 'url')}
              required />
            <span class="icon is-small is-left">
              <FontAwesomeIcon icon={faLocationArrow} />
            </span>
          </div>
        </div>
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button is-primary"
              type="submit">
              <span class="icon">
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </button>
          </div>
        </div>
      </form>
    );
  }
}