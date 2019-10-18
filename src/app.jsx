import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';
import BootstrapSelectReactRouterDomSupport from './components/BootstrapSelect/BootstrapSelectReactRouterDomSupport';
import store from './redux/store';
import './scripts/font-awesome-icon-library';
import AdministrationsView from './views/AdministrationsView';
import DataView from './views/DataView';
import LedgerView from './views/LedgerView';
import ProvidersView from './views/ProvidersView';
import TransactionsView from './views/TransactionsView';

export default function App() {
  return (
    <React.Fragment>
      <BootstrapSelectReactRouterDomSupport />

      <Provider store={store}>
        <Layout>
          <Switch>
            <Route path="/" exact>
              <LedgerView />
            </Route>
            <Route path="/transaction">
              <TransactionsView />
            </Route>
            <Route path="/administration">
              <AdministrationsView />
            </Route>
            <Route path="/provider">
              <ProvidersView />
            </Route>
            <Route path="/data">
              <DataView />
            </Route>
          </Switch>
        </Layout>
      </Provider>
    </React.Fragment>
  );
}

// export default class App extends React.Component {
//   state = { databaseStatus: 'Unknown' };

//   componentDidMount = () => {
//     this.listenForErrors();
//     this.listenForDatabaseStatus();
//     this.getDatabaseStatus();
//   };

//   listenForErrors = () => {
//     ipcRenderer.on('error', (event, { body }) => {
//       alert(body);
//     });
//   };

//   listenForDatabaseStatus = () => {
//     ipcRenderer.on('get-database-status', (event, { body }) => {
//       this.setState({ databaseStatus: body });
//     });
//   };

//   getDatabaseStatus = () => {
//     ipcRenderer.send('backend', { channel: 'get-database-status' });
//   };

//   componentWillUnmount = () => {
//     this.stopListeningForDatabaseStatus();
//     this.stopListeningForErrors();
//   };

//   stopListeningForDatabaseStatus = () => {
//     ipcRenderer.removeAllListeners('get-database-status');
//   };

//   stopListeningForErrors = () => {
//     ipcRenderer.removeAllListeners('error');
//   };

//   render = () => (
//     <Provider store={store}>
//       <Layout databaseStatus={this.state.databaseStatus}>
//         <Switch>
//           <Route path="/" exact>
//             <LedgerView />
//           </Route>
//           <Route path="/transaction">
//             <TransactionView />
//           </Route>
//           <Route path="/administration">
//             <AdministrationView />
//           </Route>
//           <Route path="/provider">
//             <ProviderView />
//           </Route>
//           <Route path="/data">
//             <DataView />
//           </Route>
//         </Switch>
//       </Layout>
//     </Provider>
//   );
// }
