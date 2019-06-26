import React from 'react';
import PropTypes from 'prop-types';

AppendGroup.propTypes = {
  children: PropTypes.node,
};

AppendGroup.defaultProps = {
  children: undefined,
};

export default function AppendGroup({ children }) {
  return <div className="input-group-append">{children}</div>;
}
