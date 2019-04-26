import { ipcRenderer } from 'electron';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AdministrationView from './views/Administration';
import DashboardView from './views/Dashboard';
import DataView from './views/Data';
import Layout from './components/Layout';
import LedgerView from './views/Ledger';
import ProviderView from './views/Provider';
import TransactionView from './views/Transaction';

import { version } from '../package.json';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      databaseStatus: 'Unknown',
    };
  }

  componentDidMount() {
    ipcRenderer.send('database', {
      header: { type: 'status', response: 'status' },
    });

    ipcRenderer.on('status', (event, data) => {
      this.setState({ databaseStatus: data.body });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('status');
  }

  render() {
    return (
      <Layout databaseStatus={this.state.databaseStatus} version={version}>
        <Switch>
          <Route exact path="/" component={DashboardView} />
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
