import PropTypes from 'prop-types';
import React from 'react';

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Wrapper({ children, ...restProps }) {
  return (
    <div
      aria-hidden="true"
      aria-labelledby="modal-title"
      className="modal fade"
      id="modal"
      role="dialog"
      tabIndex="-1"
      {...restProps}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
