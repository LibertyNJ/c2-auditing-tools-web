import React from 'react';

import { ipcRenderer } from 'electron';

import Header from '../../components/Header';
import RecordsSection from '../../components/RecordsSection';
import SearchSection from '../../components/SearchSection';
import Modal from './Modal';

export default class ProviderView extends React.Component {
  state = {
    modalIsShown: false,
  };

  handleTableRowClick = (rowData) => {
    const providerId = this.getProviderId(rowData);
    this.querySelectedProvider(providerId);
  }

  querySelectedProvider = (providerId) => {
    ipcRenderer.send('database', {
      channel: 'edit-provider',
      message: providerId,
    });
  }

  showModal = () => {
    this.setState({ modalIsShown: true });
  };

  render = () => {
    const formControlDefinitions = [
      {
        type: 'input',
        props: { type: 'text', name: 'lastName', label: 'Last name' },
      },
      {
        type: 'input',
        props: { type: 'text', name: 'firstName', label: 'First name' },
      },
      {
        type: 'input',
        props: { type: 'text', name: 'middleInitial', label: 'Middle initial' },
      },
      {
        type: 'input',
        props: { type: 'text', name: 'adcId', label: 'ADC ID' },
      },
      {
        type: 'input',
        props: { type: 'text', name: 'emarId', label: 'EMAR ID' },
      },
    ];

    const columnDefinitions = [
      {
        label: 'Last name',
        dataKey: 'lastName',
        maxWidth: 0,
      },
      {
        label: 'First name',
        dataKey: 'firstName',
        maxWidth: 0,
      },
      {
        label: 'MI',
        dataKey: 'middleInitial',
        maxWidth: 70,
      },
      {
        label: 'ADC IDs',
        dataKey: 'adcId',
        maxWidth: 0,
      },
      {
        label: 'EMAR IDs',
        dataKey: 'emarId',
        maxWidth: 0,
      },
    ];

    return (
      <React.Fragment>
        <div className="row flex-shrink-0">
          <Header>Provider</Header>
        </div>
        <div className="row flex-grow-1">
          <SearchSection formControlDefinitions={formControlDefinitions} ipcChannel="provider" />
          <RecordsSection
            columnDefinitions={columnDefinitions}
            ipcChannel="provider"
            handleTableRowClick={this.handleTableRowClick}
          />
        </div>
        <Modal isShown={this.state.modalIsShown} />
      </React.Fragment>
    );
  };
}
