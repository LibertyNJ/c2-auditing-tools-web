import React from 'react';
import PropTypes from 'prop-types';

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function ModalWrapper({ children }) {
  return (
    <div
      id="modal"
      className="modal fade"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modal-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
