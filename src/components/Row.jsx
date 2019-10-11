import React from 'react';
import PropTypes from 'prop-types';

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Row.defaultProps = {
  className: '',
};

export default function Row({ children, className }) {
  return <div className={`row ${className}`}>{children}</div>;
}
