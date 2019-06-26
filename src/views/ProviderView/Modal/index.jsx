import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Wrapper from './Wrapper';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

import '../../../../node_modules/bootstrap/js/dist/modal';

export default class Modal extends React.Component {
  static propTypes = {
    isShown: PropTypes.bool.isRequired,
  };

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    $('#modal').modal({ show: false });
  };

  componentDidUpdate({ isShown }) {
    if (this.shouldBeShown(isShown)) {
      this.show();
    } else if (this.shouldBeHidden(isShown)) {
      this.hide();
    }
  }

  shouldBeShown = isShown => !isShown && this.props.isShown;

  show = () => {
    $('#modal').modal('show');
  };

  shouldBeHidden = isShown => isShown && !this.props.isShown;

  hide = () => {
    $('#modal').modal('hide');
  };

  componentWillUnmount = () => {
    this.dispose();
  };

  dispose = () => {
    $('modal').modal('dispose');
  };

  render = () => (
    <Wrapper>
      <Header hide={this.hide} />
      <Body />
      <Footer />
    </Wrapper>
  );
}
