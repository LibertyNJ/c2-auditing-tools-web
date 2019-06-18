import PropTypes from 'prop-types';
import React from 'react';

import SVGIcon from '../SVGIcon';

const ModalHeader = ({ closeModal }) => (
  <header className="modal-header">
    <h3 className="text-primary modal-title">Edit Provider</h3>
    <div className="p-3">
      <CloseButton closeModal={closeModal} />
    </div>
  </header>
);

ModalHeader.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

const CloseButton = ({ closeModal }) => (
  <button
    type="button"
    className="close p-0"
    aria-label="Close"
    onClick={closeModal}
  >
    <SVGIcon
      className="align-baseline"
      type="window-close"
      width="1em"
      height="1em"
      fill="red"
    />
  </button>
);

CloseButton.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ModalHeader;
