import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'

export default class Speak extends Component {

  constructor(props) {
  	super(props);
  	this.state = { generating: false };
		this.generate = this.generate.bind(this);
  }

  generate() {
    this.setState({ generating: true });
    this.props.onGenerate()
      .then(() => this.setState({ generating: false }));
  }

  render(props, state) {
		const isLoading = (state.generating) ? 'is-loading' : '';
		return(
      <a class={`button is-medium is-danger is-flex ${isLoading}`}
        onClick={this.generate}>
        <span class="icon">
          <FontAwesomeIcon icon={faKey} />
        </span>
        <span>Generate</span>
      </a>
    );
  }

}