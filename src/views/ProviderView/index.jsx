import React from 'react';

import { ipcRenderer } from 'electron';

import Input from '../../components/Input';
import RecordsSection from '../../components/RecordsSection';
import Row from '../../components/Row';
import SearchSection from '../../components/SearchSection';
import View from '../../components/View';

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
    <View heading="Providers">
      <Row className="flex-grow-1 flex-shrink-1">
        <SearchSection channel="get-providers">
          <Input label="Last name" name="lastName" type="text" />
          <Input label="First name" name="firstName" type="text" />
          <Input label="Middle initial" name="middleInitial" type="text" />
          <Input label="ADC ID" name="adcId" type="text" />
          <Input label="EMAR ID" name="emarId" type="text" />
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
      </Row>
      <Modal ref={this.modalRef} />
    </View>
  );
}
