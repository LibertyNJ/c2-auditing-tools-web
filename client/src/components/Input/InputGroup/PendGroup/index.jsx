import PropTypes from 'prop-types';
import React from 'react';

PendGroup.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['append', 'prepend']).isRequired,
};

export default function PendGroup({ children, type, ...restProps }) {
  const className = `input-group-${type}`;
  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
}
