import React from 'react';
import PropTypes from 'prop-types';

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Wrapper({ children }) {
  return (
    <div
      aria-hidden="true"
      aria-labelledby="modal-title"
      className="modal fade"
      id="modal"
      role="dialog"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
