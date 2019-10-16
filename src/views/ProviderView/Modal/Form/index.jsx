import { ipcRenderer } from 'electron';
import React from 'react';

import AssignNameSection from './AssignNameSection';
import ProviderNameSection from './ProviderNameSection';
import UnassignNameSection from './UnassignNameSection';

import { getSelectedOptionValues, isSelectElement } from './utilities';

export default class Form extends React.Component {
  state = {
    assignedProviderAdcs: [],
    assignedProviderEmars: [],
    isSubmitted: false,
    providerAdcIdsToBeAssigned: [],
    providerAdcIdsToBeUnassigned: [],
    providerEmarIdsToBeAssigned: [],
    providerEmarIdsToBeUnassigned: [],
    unassignedProviderAdcs: [],
    unassignedProviderEmars: [],
  };

  componentDidMount = () => {
    this.listenForBackendCommunication();
  };

  listenForBackendCommunication = () => {
    ipcRenderer.on('get-provider-modal', this.setStateAndInitialState);
  };

  setStateAndInitialState = (event, { body }) => {
    this.setState(
      {
        providerAdcIdsToBeAssigned: [],
        providerAdcIdsToBeUnassigned: [],
        providerEmarIdsToBeAssigned: [],
        providerEmarIdsToBeUnassigned: [],
        ...body,
      },
      this.setInitialState,
    );
  };

  setInitialState = () => {
    this.initialState = { ...this.state };
  };

  componentWillUnmount = () => {
    this.stopListeningForBackendCommunication();
  };

  stopListeningForBackendCommunication = () => {
    ipcRenderer.removeAllListeners('get-provider-modal');
    ipcRenderer.removeAllListeners('update-provider');
  };

  handleChange = ({ target }) => {
    if (isSelectElement(target)) {
      this.setSelectControlState(target);
    } else {
      this.setOtherControlState(target);
    }
  };

  setSelectControlState = (target) => {
    const values = getSelectedOptionValues(target);
    this.setState({ [target.name]: values });
  };

  setOtherControlState = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  handleReset = (event) => {
    event.preventDefault();
    this.restoreInitialState();
  };

  restoreInitialState = () => {
    this.setState({ ...this.initialState });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.toggleIsSubmitted();
    this.listenForBackendResponse();
    this.sendUpdateToBackend();
  };

  sendUpdateToBackend = () => {
    ipcRenderer.send('backend', {
      body: this.state,
      channel: 'update-provider',
    });
  };

  listenForBackendResponse = () => {
    ipcRenderer.once('update-provider', this.handleBackendResponse);
  };

  handleBackendResponse = () => {
    this.sendProvidersQueryToBackend();
    this.sendModalQueryToBackend();
    this.toggleIsSubmitted();
  };

  sendProvidersQueryToBackend = () => {
    ipcRenderer.send('backend', {
      body: {},
      channel: 'get-providers',
    });
  };

  sendModalQueryToBackend = () => {
    ipcRenderer.send('backend', {
      body: this.state.providerId,
      channel: 'get-provider-modal',
    });
  };

  toggleIsSubmitted = () => {
    this.setState(state => ({ isSubmitted: !state.isSubmitted }));
  };

  render = () => (
    <form id="modal-form" onSubmit={this.handleSubmit} onReset={this.handleReset}>
      <ProviderNameSection
        disabled={this.state.isSubmitted}
        firstName={this.state.firstName}
        handleChange={this.handleChange}
        lastName={this.state.lastName}
        middleInitial={this.state.middleInitial}
      />
      <AssignNameSection
        disabled={this.state.isSubmitted}
        handleChange={this.handleChange}
        providerAdcIdsToBeAssigned={this.state.providerAdcIdsToBeAssigned}
        providerEmarIdsToBeAssigned={this.state.providerEmarIdsToBeAssigned}
        unassignedProviderAdcs={this.state.unassignedProviderAdcs}
        unassignedProviderEmars={this.state.unassignedProviderEmars}
      />
      <UnassignNameSection
        assignedProviderAdcs={this.state.assignedProviderAdcs}
        assignedProviderEmars={this.state.assignedProviderEmars}
        disabled={this.state.isSubmitted}
        handleChange={this.handleChange}
        providerAdcIdsToBeUnassigned={this.state.providerAdcIdsToBeUnassigned}
        providerEmarIdsToBeUnassigned={this.state.providerEmarIdsToBeUnassigned}
      />
    </form>
  );
}
