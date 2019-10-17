import React from 'react';
import { ipcRenderer } from 'electron';

export default class ProviderName extends React.PureComponent {
  CHANNEL = 'get-provider-modal';

  state = {};

  componentDidMount = () => {
    this.listenForBackendCommunication();
  };

  listenForBackendCommunication = () => {
    ipcRenderer.on(this.CHANNEL, this.setProviderName);
  };

  setProviderName = (event, { body }) => {
    const { firstName, lastName, middleInitial } = body;
    this.setState({
      firstName,
      lastName,
      middleInitial,
    });
  };

  componentWillUnmount = () => {
    this.stopListeningForBackendCommunication();
  };

  stopListeningForBackendCommunication = () => {
    ipcRenderer.removeAllListeners(this.CHANNEL);
  };

  render = () => (
    <p className="lead">
      {this.state.lastName}, {this.state.firstName} {this.state.middleInitial}
    </p>
  );
}
