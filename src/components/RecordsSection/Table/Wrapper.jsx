import React from 'react';
import PropTypes from 'prop-types';

import { AutoSizer } from 'react-virtualized';

Wrapper.propTypes = {
  children: PropTypes.func.isRequired,
};

export default function Wrapper({ children }) {
  return (
    <div className="h-100">
      <AutoSizer>{children}</AutoSizer>
    </div>
  );
}
