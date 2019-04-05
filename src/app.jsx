import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';
import Data from './views/Data';


export default class App extends React.Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Data} />
        </Switch>
      </Layout>
    );
  }
}
