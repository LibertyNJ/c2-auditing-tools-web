import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './components/UI/Header';
import Footer from './components/UI/Footer/Footer';
import Navigation from './components/UI/Navigation';
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Balance from './views/Balance';
import Users from './views/Users';
import Pyxis from './views/Pyxis';
import Administrations from './views/Administrations';

const version = '0.0.0';

export default class App extends React.Component {
  render() {
    return (
      <div className="vh-100 d-flex flex-column">
        <Header heading="C2 Auditing Tools" />
        <Navigation />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/users" component={Users} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/balance" component={Balance} />
          <Route path="/pyxis" component={Pyxis} />
          <Route path="/administrations" component={Administrations} />
        </Switch>
        <Footer version={version} />
      </div>
    );
  }
}
