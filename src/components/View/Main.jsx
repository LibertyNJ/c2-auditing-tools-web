import React from 'react';
import PropTypes from 'prop-types';

Main.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Main.defaultProps = {
  className: '',
};

export default function Main({ children, className }) {
  return <main className={`container-fluid d-flex flex-column ${className}`}>{children}</main>;
}
