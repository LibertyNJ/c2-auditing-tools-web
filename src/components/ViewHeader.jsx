import PropTypes from 'prop-types';
import React from 'react';

const ViewHeader = ({ children }) => (
  <header className="col">
    <h1 className="text-primary text-center">{children}</h1>
  </header>
);

ViewHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ViewHeader;
