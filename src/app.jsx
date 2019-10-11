'use-strict';

import { ipcRenderer } from 'electron';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';
import './scripts/font-awesome-icon-library';
import AdministrationView from './views/AdministrationView';
import DataView from './views/DataView';
import LedgerView from './views/LedgerView';
import ProviderView from './views/ProviderView';
import TransactionView from './views/TransactionView';
import { version } from '../package.json';

export default class App extends React.Component {
  state = { databaseStatus: 'Unknown' };

  componentDidMount = () => {
    this.listenForErrors();
    this.listenForDatabaseStatus();
    this.getDatabaseStatus();
  };

  listenForErrors = () => {
    ipcRenderer.on('error', (event, { body }) => {
      alert(body);
    });
  };

  listenForDatabaseStatus = () => {
    ipcRenderer.on('get-database-status', (event, { body }) => {
      this.setState({ databaseStatus: body });
    });
  };

  getDatabaseStatus = () => {
    ipcRenderer.send('backend', { channel: 'get-database-status' });
  };

  componentWillUnmount = () => {
    this.stopListeningForDatabaseStatus();
    this.stopListeningForErrors();
  };

  stopListeningForDatabaseStatus = () => {
    ipcRenderer.removeAllListeners('get-database-status');
  };

  stopListeningForErrors = () => {
    ipcRenderer.removeAllListeners('error');
  };

  render = () => (
    <Layout databaseStatus={this.state.databaseStatus} version={version}>
      <Switch>
        <Route path="/" exact component={LedgerView} />
        <Route path="/transaction" component={TransactionView} />
        <Route path="/administration" component={AdministrationView} />
        <Route path="/provider" component={ProviderView} />
        <Route path="/data" component={DataView} />
      </Switch>
    </Layout>
  );
}
