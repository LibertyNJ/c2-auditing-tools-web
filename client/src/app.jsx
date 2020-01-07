import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';

import { initializeBootstrapSelect } from './components/BootstrapSelect';
import Layout from './components/Layout';
import store from './redux/store';
import './scripts/font-awesome-icon-library';
import './styles/style.css';
import AdministrationsView from './views/AdministrationsView';
// import DataView from './views/DataView';
import LedgerView from './views/LedgerView';
// import ProvidersView from './views/ProvidersView';
import TransactionsView from './views/TransactionsView';

export default function App() {
  const location = useLocation();
  useEffect(initializeBootstrapSelect, [location]);
  useEffect(showSampleAlert, []);
  return (
    <React.Fragment>
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
            {/* <Route path="/provider">
              <ProvidersView />
            </Route>
            <Route path="/data">
              <DataView />
            </Route> */}
          </Switch>
        </Layout>
      </Provider>
    </React.Fragment>
  );
}

function showSampleAlert() {
  window.alert(
    'This sample application contains sanitized data from between 00:00 and 02:00, August 1, 2019. Try it on a desktop or laptop computer for the best experience.'
  );
}
