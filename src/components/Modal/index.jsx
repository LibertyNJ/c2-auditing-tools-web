import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Body from './Body';
import Footer from './Footer';
import Header from './Header';
import Wrapper from './Wrapper';

import '../../../node_modules/bootstrap/js/dist/modal';

export default class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    footerContent: PropTypes.node,
    heading: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
  };

  static defaultProps = {
    footerContent: null,
  };

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    $('#modal').modal({ show: false });
  };

  show = () => {
    $('#modal').modal('show');
  };

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
      <Header hideModal={this.hide} level={this.props.level}>
        {this.props.heading}
      </Header>
      <Body>{this.props.children}</Body>
      <Footer>{this.props.footerContent}</Footer>
    </Wrapper>
  );
}
