import React from 'react';
import PropTypes from 'prop-types';

import { Column } from 'react-virtualized';
import Header from './Header';

import getCellData from './get-cell-data';

VirtualizedColumn.propTypes = {
  dataKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
};

VirtualizedColumn.defaultProps = {
  maxWidth: null,
};

export default function VirtualizedColumn({ dataKey, label, maxWidth }) {
  return (
    <Column
      cellDataGetter={getCellData}
      dataKey={dataKey}
      flexGrow={1}
      flexShrink={1}
      headerRenderer={Header}
      key={dataKey}
      label={label}
      maxWidth={maxWidth}
      width={1}
    />
  );
}
