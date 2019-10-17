import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Table as VirtualizedTable } from 'react-virtualized';

import Column from './Column';
import NoRecordsAlert from './NoRecordsAlert';
import sort from './sort';
import Wrapper from './Wrapper';

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      maxWidth: PropTypes.number,
    }),
  ).isRequired,
  handleTableRowClick: PropTypes.func,
  wrapperClassName: PropTypes.string,
};

export default function Table({
  columns, handleTableRowClick, wrapperClassName, ...restProps
}) {
  const Columns = columns.map(Column);
  const virtualizedTableRef = useRef();
  return (
    <Wrapper className={wrapperClassName}>
      {({ height, width }) => (
        <VirtualizedTable
          headerHeight={38}
          height={height}
          noRowsRenderer={NoRecordsAlert}
          onRowClick={handleTableRowClick || null}
          ref={virtualizedTableRef}
          rowClassName={handleTableRowClick ? 'hover' : null}
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

function getRow({ index }) {
  return this.state.records[index];
}

function sortRecords({ sortBy, sortDirection }) {
  this.setState((state) => {
    const records = [...state.records];
    sort(records, sortBy);
    return {
      records: sortDirection === 'DESC' ? records.reverse() : records,
      sortBy,
      sortDirection,
    };
  });
}

// export default class Table extends React.Component {
//   static propTypes = {
//     channel: PropTypes.string.isRequired,
//     columns: PropTypes.arrayOf(
//       PropTypes.shape({
//         dataKey: PropTypes.string.isRequired,
//         label: PropTypes.string.isRequired,
//         maxWidth: PropTypes.number,
//       }),
//     ).isRequired,
//     handleTableRowClick: PropTypes.func,
//     wrapperClassName: PropTypes.string,
//   };

//   static defaultProps = {
//     handleTableRowClick: null,
//     wrapperClassName: null,
//   };

//   virtualizedTableRef = React.createRef();

//   Columns = this.props.columns.map(Column);

//   state = {
//     records: [],
//     sortBy: null,
//   };

//   componentDidMount = () => {
//     this.listenForBackendCommunication();
//   };

//   listenForBackendCommunication = () => {
//     ipcRenderer.on(this.props.channel, (event, message) => {
//       this.setRecordsAndUpdateTable(message);
//     });
//   };

//   setRecordsAndUpdateTable({ body }) {
//     this.setState(
//       {
//         records: body,
//         sortBy: null,
//         sortDirection: null,
//       },
//       () => this.virtualizedTableRef.current.forceUpdateGrid(),
//     );
//   }

//   componentWillUnmount = () => {
//     this.stopListeningForBackendCommunication();
//   };

//   stopListeningForBackendCommunication = () => {
//     ipcRenderer.removeAllListeners(this.props.channel);
//   };

//   sortRecords = ({ sortBy, sortDirection }) => {
//     this.setState((state) => {
//       const records = [...state.records];
//       sort(records, sortBy);

//       return {
//         records: sortDirection === 'DESC' ? records.reverse() : records,
//         sortBy,
//         sortDirection,
//       };
//     });
//   };

//   getRow = ({ index }) => this.state.records[index];

//   render = () => (
//     <Wrapper className={this.props.wrapperClassName}>
//       {({ height, width }) => (
//         <VirtualizedTable
//           headerHeight={38}
//           height={height}
//           noRowsRenderer={NoRecordsAlert}
//           onRowClick={this.props.handleTableRowClick ? this.props.handleTableRowClick : null}
//           ref={this.virtualizedTableRef}
//           rowClassName={this.props.handleTableRowClick ? 'hover' : null}
//           rowCount={this.state.records.length}
//           rowGetter={this.getRow}
//           rowHeight={68}
//           sort={this.sortRecords}
//           sortBy={this.state.sortBy}
//           sortDirection={this.state.sortDirection}
//           width={width}
//         >
//           {this.Columns}
//         </VirtualizedTable>
//       )}
//     </Wrapper>
//   );
// }
