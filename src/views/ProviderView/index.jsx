import React from 'react';

import { ipcRenderer } from 'electron';

import RecordsSection from '../../components/RecordsSection';
import SearchSection from '../../components/SearchSection';
import ConnectedInput from '../../redux/containers/ConnectedInput';

import Modal from './Modal';

import extractProviderId from './extract-provider-id';

export default class ProviderView extends React.Component {
  modalRef = React.createRef();

  handleTableRowClick = ({ rowData }) => {
    const providerId = extractProviderId(rowData);
    this.sendProviderModalQuery(providerId);
    this.listenForBackendResponse();
  };

  sendProviderModalQuery = (providerId) => {
    ipcRenderer.send('backend', {
      body: providerId,
      channel: 'get-provider-modal',
    });
  };

  listenForBackendResponse = () => {
    ipcRenderer.once('get-provider-modal', this.showModal);
  };

  showModal = () => {
    this.modalRef.current.show();
  };

  componentWillUnmount = () => {
    this.stopListeningForBackendCommunication();
  };

  stopListeningForBackendCommunication = () => {
    ipcRenderer.removeAllListeners('provider-modal');
  };

  render = () => (
    <React.Fragment>
      <SearchSection view="providers">
        <ConnectedInput label="Last name" name="lastName" type="text" />
        <ConnectedInput label="First name" name="firstName" type="text" />
        <ConnectedInput label="Middle initial" name="middleInitial" type="text" />
        <ConnectedInput label="ADC ID" name="adcId" type="text" />
        <ConnectedInput label="EMAR ID" name="emarId" type="text" />
      </SearchSection>
      <RecordsSection
        channel="get-providers"
        columns={[
          { dataKey: 'lastName', label: 'Last name' },
          { dataKey: 'firstName', label: 'First name' },
          { dataKey: 'middleInitial', label: 'MI', maxWidth: 70 },
          { dataKey: 'adcIds', label: 'ADC IDs' },
          { dataKey: 'emarIds', label: 'EMAR IDs' },
        ]}
        handleTableRowClick={this.handleTableRowClick}
      />
      <Modal ref={this.modalRef} />
    </React.Fragment>
  );
}
