import { h, Component } from 'preact';
import emitter from '../../services/event_emitter';

export default class Message extends Component {

  constructor(props) {
  	super(props);
  	this.state = { msg: '', visible: false };
		this.hide = this.hide.bind(this);
		this.show = this.show.bind(this);
  }

  componentDidMount(){
    emitter.on('DISPLAY_MESSAGE', this.show);
  }

  componentWillUnmount() {
    emitter.off('DISPLAY_MESSAGE', this.show);
  }

  show(msg) {
    this.setState({ msg, visible: true });
  }

  hide() {
    if (this.state.visible) {
      this.setState({ msg: '', visible: false });
    }
  }

  render(props, state) {
    if (!state.visible) return null;
    return(
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="notification">
            {state.msg}
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close"
          onClick={this.hide}>
        </button>
      </div>
    );
  }
}
