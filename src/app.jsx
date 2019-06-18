import { ipcRenderer } from 'electron';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';

import AdministrationView from './views/Administration';
import DashboardView from './views/Dashboard';
import DataView from './views/Data';
import LedgerView from './views/Ledger';
import ProviderView from './views/Provider';
import TransactionView from './views/Transaction';

import { version } from '../package.json';

export default class App extends React.Component {
  state = { databaseStatus: 'Unknown' };

  componentDidMount = () => {
    this.listenForDatabaseStatusUpdates();
    this.queryDatabaseStatus();
  };

  listenForDatabaseStatusUpdates = () => {
    ipcRenderer.on('status', (event, data) => {
      this.setState({ databaseStatus: data.body });
    });
  };

  queryDatabaseStatus = () => {
    ipcRenderer.send('database', {
      header: { type: 'status', response: 'status' },
    });
  };

  componentWillUnmount = () => {
    this.stopListeningForDatabaseStatusUpdates();
  };

  stopListeningForDatabaseStatusUpdates = () => {
    ipcRenderer.removeAllListeners('status');
  };

  render() {
    return (
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
}
