import { h, Component } from 'preact';
import emitter from '../../services/event_emitter';
import style from './notification/style.scss';

export default class Notification extends Component {

  constructor(props) {
  	super(props);
  	this.state = { type: '', text: '', visible: false };
		this.hide = this.hide.bind(this);
		this.onError = this.onError.bind(this);
		this.onInfo = this.onInfo.bind(this);
  }

  componentDidMount(){
    emitter.on('DISPLAY_ERROR', this.onError);
    emitter.on('DISPLAY_INFO', this.onInfo);
  }

  componentWillUnmount() {
    emitter.off('DISPLAY_ERROR', this.onError);
    emitter.off('DISPLAY_INFO', this.onInfo);
  }

  onError(msg) {
    this.show('is-danger', msg);
    setTimeout(() => this.hide(), this.props.duration || 2000);
  }

  onInfo(msg) {
    this.show('is-info', msg);
    setTimeout(() => this.hide(), this.props.duration || 2000);
  }

  show(type, text) {
    this.setState({ type, text, visible: true });
  }

  hide() {
    if (this.state.visible) {
      this.setState({ type: '', text: '', visible: false });
    }
  }

  render(props, state) {
    if (!state.visible) return null;
  	return (
      <div class={style['notification-container']}>
        <div class={`notification ${state.type}`}>
          <button class="delete" onClick={this.hide}></button>
          <p>{state.text}</p>
        </div>
      </div>
    );
  }
}