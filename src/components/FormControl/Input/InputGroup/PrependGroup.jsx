import React from 'react';
import PropTypes from 'prop-types';

PrependGroup.propTypes = {
  children: PropTypes.node,
};

PrependGroup.defaultProps = {
  children: undefined,
};

export default function PrependGroup({ children }) {
  return <div className="input-group-prepend">{children}</div>;
}
