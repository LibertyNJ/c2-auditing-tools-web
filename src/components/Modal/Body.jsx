import React from 'react';
import PropTypes from 'prop-types';

Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Body({ children }) {
  return <div className="modal-body">{children}</div>;
}
