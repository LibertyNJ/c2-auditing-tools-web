import React from 'react';
import PropTypes from 'prop-types';

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Wrapper({ children }) {
  return (
    <div className="row">
      <div className="col mx-auto" style={{ maxWidth: '33em' }}>
        {children}
      </div>
    </div>
  );
}
