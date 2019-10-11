import React from 'react';
import PropTypes from 'prop-types';

import { AutoSizer } from 'react-virtualized';

Wrapper.propTypes = {
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Wrapper.defaultProps = {
  className: null,
};

export default function Wrapper({ children, className }) {
  return (
    <div className={className}>
      <AutoSizer>{children}</AutoSizer>
    </div>
  );
}
