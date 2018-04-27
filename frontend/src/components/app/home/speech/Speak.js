import { h, Component } from 'preact';
import linkState from 'linkstate';

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
        <input type="text" 
          placeholder="Blabla..."
          value={state.speech}
          onChange={linkState(this, 'speech')}
          required/>
        <input type="submit" value="Speak" />
      </form>
    );
  }
}