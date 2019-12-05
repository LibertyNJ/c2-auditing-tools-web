import PropTypes from 'prop-types';
import React from 'react';
import { Table as VirtualizedTable } from 'react-virtualized';

import Column from './Column';
import NoRecordsAlert from './NoRecordsAlert';
import Wrapper from './Wrapper';

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      maxWidth: PropTypes.number,
    }),
  ).isRequired,
  onRowClick: PropTypes.func,
  wrapperClassName: PropTypes.string,
};

export default function Table({
  columns, onRowClick, wrapperClassName, ...restProps
}) {
  const Columns = columns.map(Column);
  return (
    <Wrapper className={wrapperClassName}>
      {({ height, width }) => (
        <VirtualizedTable
          headerHeight={38}
          height={height}
          noRowsRenderer={NoRecordsAlert}
          onRowClick={onRowClick || null}
          rowClassName={onRowClick ? 'hover' : null}
          rowHeight={68}
          width={width}
          {...restProps}
        >
          {Columns}
        </VirtualizedTable>
      )}
    </Wrapper>
  );
}
