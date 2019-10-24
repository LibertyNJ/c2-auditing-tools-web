import PropTypes from 'prop-types';
import React from 'react';
import { Column } from 'react-virtualized';

import getCellData from './get-cell-data';
import Header from './Header';

VirtualizedColumn.propTypes = {
  dataKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
};

VirtualizedColumn.defaultProps = {
  maxWidth: null,
};

export default function VirtualizedColumn({
  dataKey, label, maxWidth, ...restProps
}) {
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
      {...restProps}
    />
  );
}
