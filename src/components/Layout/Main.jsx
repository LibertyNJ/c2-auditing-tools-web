import React from 'react';
import PropTypes from 'prop-types';

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Main({ children }) {
  return <main className="container-fluid d-flex flex-column flex-grow-1">{children}</main>;
}
