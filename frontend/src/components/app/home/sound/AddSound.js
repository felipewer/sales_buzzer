import { h, Component } from 'preact';
import linkState from 'linkstate';

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
        <input type="text"
          placeholder="name"
          value={state.sound}
          onChange={linkState(this, 'sound')}
          required />
        <input type="url"
          placeholder="file url"
          value={state.url}
          onChange={linkState(this, 'url')}
          required />
        <input type="submit" value="Add" />
      </form>
    );
  }
}