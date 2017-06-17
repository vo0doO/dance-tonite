/** @jsx h */
import { h, Component } from 'preact';
import Portal from 'preact-portal';

import './style.scss';

import Align from '../Align';
import ButtonClose from '../ButtonClose';
import feature from '../../utils/feature';
import audio from '../../audio';
import aboutSrc from './content.md';

let content;

export default class About extends Component {
  constructor() {
    super();
    this.state = {
      content,
    };
  }

  componentWillMount() {
    document.body.classList.remove('mod-overflow-hidden');
    if (feature.isMobile) {
      audio.pause();
    } else {
      audio.fadeOut().then(() => {
        if (this.mounted) {
          audio.pause();
        }
      });
    }
    this.asyncMount();
  }

  componentWillUnmount() {
    document.body.classList.add('mod-overflow-hidden');
    audio.play();
    audio.fadeIn(0.5);
  }

  async asyncMount() {
    if (content) return;
    const response = await fetch(aboutSrc);
    content = await response.text();
    this.setState({ content });
  }

  render() {
    return (
      <Portal into="body">
        <div className="about">
          <Align type="top-right">
            <ButtonClose onClick={this.props.onClose} />
          </Align>
          <div
            className="about-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Portal>
    );
  }
}
