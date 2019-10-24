import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer } from 'react-virtualized';

Wrapper.propTypes = {
  children: PropTypes.func.isRequired,
};

export default function Wrapper({ children, ...restProps }) {
  return (
    <div {...restProps}>
      <AutoSizer>{children}</AutoSizer>
    </div>
  );
}
