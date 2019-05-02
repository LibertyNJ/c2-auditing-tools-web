import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';
import { AutoSizer, Column, Table } from 'react-virtualized';

// const columns = props =>
//   props.columns.map(column => (
//     <Column
//       label={column.label}
//       dataKey={column.dataKey}
//       width={column.width}
//     />
//   ));

// const RecordsTableSection = props => {
//   console.log(props);
//   return (
//     <Table
//       width={700}
//       height={300}
//       headerHeight={20}
//       rowHeight={100}
//       rowCount={props.records.length}
//       rowGetter={({ index }) => props.records[index]}
//     >
//       {columns}
//     </Table>
//   );
// };

const RecordsTableSection = props => {
  console.log(props);

  const columns = props.columns.map(({ label, dataKey, width, minWidth }) => (
    <Column
      key={dataKey}
      label={label}
      dataKey={dataKey}
      width={width}
      minWidth={minWidth}
      flexGrow={1}
      flexShrink={0}
    />
  ));

  return (
    <section className="col-9 d-flex flex-column">
      <header>
        <h2>Records</h2>
      </header>
      <div className="h-100">
        <AutoSizer>
          {({ width, height }) => (
            <Table
              width={width}
              height={height}
              headerHeight={38}
              rowHeight={34}
              rowCount={props.records.length}
              rowGetter={({ index }) => props.records[index]}
            >
              {columns}
            </Table>
          )}
        </AutoSizer>
      </div>
    </section>
  );
};

export default RecordsTableSection;
