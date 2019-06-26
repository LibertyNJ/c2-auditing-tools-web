import { ipcRenderer } from 'electron';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';

import AdministrationView from './views/AdministrationView';
import DashboardView from './views/DashboardView';
import DataView from './views/DataView';
import LedgerView from './views/LedgerView';
import ProviderView from './views/ProviderView';
import TransactionView from './views/TransactionView';

import { version } from '../package.json';

export default class App extends React.Component {
  state = { databaseStatus: 'Unknown' };

  componentDidMount = () => {
    this.listenForDatabaseStatusUpdates();
    this.queryDatabaseStatus();
  };

  listenForDatabaseStatusUpdates = () => {
    ipcRenderer.on('status', (event, data) => {
      this.setState({ databaseStatus: data });
    });
  };

  queryDatabaseStatus = () => {
    ipcRenderer.send('database', { channel: 'status', message: '' });
  };

  componentWillUnmount = () => {
    this.stopListeningForDatabaseStatusUpdates();
  };

  stopListeningForDatabaseStatusUpdates = () => {
    ipcRenderer.removeAllListeners('status');
  };

  render = () => (
    <Layout databaseStatus={this.state.databaseStatus} version={version}>
      <Switch>
        <Route path="/" exact component={DashboardView} />
        <Route path="/ledger" component={LedgerView} />
        <Route path="/transaction" component={TransactionView} />
        <Route path="/administration" component={AdministrationView} />
        <Route path="/provider" component={ProviderView} />
        <Route path="/data" component={DataView} />
      </Switch>
    </Layout>
  );
}
