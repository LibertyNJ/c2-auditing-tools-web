import 'bootstrap/js/dist/modal';
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Header from './Header';
import Wrapper from './Wrapper';

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  footerContent: PropTypes.node,
  heading: PropTypes.string.isRequired,
};

export default function Modal({
  children, footerContent, heading, ...restProps
}) {
  useEffect(initializeModal, []);
  return (
    <Wrapper {...restProps}>
      <Header heading={heading} hideModal={hideModal} />
      <div className="modal-body">{children}</div>
      <footer className="modal-footer">{footerContent}</footer>
    </Wrapper>
  );
}

function initializeModal() {
  $('#modal').modal({ show: false });
  return disposeModal;
}

function disposeModal() {
  $('modal').modal('dispose');
}

function hideModal() {
  $('#modal').modal('hide');
}

export function showModal() {
  $('#modal').modal('show');
}
