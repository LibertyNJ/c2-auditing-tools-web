import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import Layout from './components/Layout';
import DataView from './views/Data';
import TransactionView from './views/Transaction';
import AdministrationView from './views/Administration';
import LedgerView from './views/Ledger';
import ProviderView from './views/Provider';
import Dashboard from './views/Dashboard';

import { version } from '../package.json';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      databaseStatus: 'Unknown',
    };
  }

  componentWillMount() {
    ipcRenderer.send('database', {
      header: 'status',
    });

    ipcRenderer.on('database', (event, data) => {
      if (data.header === 'status') {
        this.setState({ databaseStatus: data.body });
      }
    });
  }

  render() {
    return (
      <Layout databaseStatus={this.state.databaseStatus} version={version}>
        <Switch>
          <Route path="/data" component={DataView} />
          <Route path="/transaction" component={TransactionView} />
          <Route path="/administration" component={AdministrationView} />
          <Route path="/ledger" component={LedgerView} />
          <Route path="/provider" component={ProviderView} />
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </Layout>
    );
  }
}
