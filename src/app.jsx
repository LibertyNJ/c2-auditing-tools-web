import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Data from './views/Data';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Balance from './views/Balance';
import Providers from './views/Providers';
import Pyxis from './views/Pyxis';
import Administrations from './views/Administrations';
import ConfigureProviders from './views/ConfigureProviders';
import ConfigureMedicationProducts from './views/ConfigureMedicationProducts';
import Help from './views/Help';

const version = '0.0.0';

export default class App extends React.Component {
  render() {
    return (
      <div className="vh-100 d-flex flex-column">
        <Header />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/providers" component={Providers} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/balance" component={Balance} />
          <Route path="/pyxis" component={Pyxis} />
          <Route path="/administrations" component={Administrations} />
          <Route path="/data" component={Data} />
          <Route path="/configure/providers" component={ConfigureProviders} />
          <Route
            path="/configure/medication-products"
            component={ConfigureMedicationProducts}
          />
          <Route path="/help" component={Help} />
        </Switch>
        <Footer version={version} />
      </div>
    );
  }
}
