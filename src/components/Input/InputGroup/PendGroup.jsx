import React from 'react';
import PropTypes from 'prop-types';

PendGroup.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
};

export default function PendGroup({ children, type }) {
  return <div className={`input-group-${type}`}>{children}</div>;
}
