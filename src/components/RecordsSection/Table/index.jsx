import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

import { Column, Table as VirtualizedTable } from 'react-virtualized';
import Wrapper from './Wrapper';

import ColumnHeader from './ColumnHeader';
import NoRecordsAlert from './NoRecordsAlert';

export default class Table extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey: PropTypes.string,
        label: PropTypes.string,
        maxWidth: PropTypes.number,
      }),
    ).isRequired,
    handleTableRowClick: PropTypes.func,
    ipcChannel: PropTypes.string.isRequired,
  };

  static defaultProps = {
    handleTableRowClick: undefined,
  };

  state = {
    records: [],
    sortBy: '',
  };

  componentDidMount = () => {
    this.listenForDatabaseCommunication();
  };

  listenForDatabaseCommunication = () => {
    ipcRenderer.on(this.props.ipcChannel, (event, data) => {
      this.setRecords(data);
    });
  };

  setRecords = ({ body }) => {
    this.setState({ records: body, sortBy: '', sortDirection: null });
  };

  componentWillUnmount = () => {
    this.stopListeningForDatabaseCommunication();
  };

  stopListeningForDatabaseCommunication = () => {
    ipcRenderer.removeAllListeners(this.props.ipcChannel);
  };

  sortRecords({ sortBy, sortDirection }) {
    this.setState((state) => {
      const records = [...state.records];

      Table.sort(records, sortBy);

      return {
        sortBy,
        sortDirection,
        records: sortDirection === 'DESC' ? records.reverse() : records,
      };
    });
  }

  static sort = (records, sortBy) => {
    records.sort((recordA, recordB) => {
      const valueA = recordA[sortBy];
      const valueB = recordB[sortBy];

      if (Table.isNumber(valueA)) {
        return Table.sortByNumericalOrder(valueA, valueB);
      }

      return Table.sortByAlphabeticalOrder(valueA, valueB);
    });
  };

  static isNumber = value => typeof value === 'number';

  static sortByNumericalOrder = (valueA, valueB) => valueA - valueB;

  static sortByAlphabeticalOrder = (valueA, valueB) => {
    const DECREASE_ELEMENT_A_INDEX = -1;
    const INCREASE_ELEMENT_A_INDEX = 1;
    const NO_CHANGE = 0;

    if (Table.isInAlphabeticalOrder(valueA, valueB)) {
      return DECREASE_ELEMENT_A_INDEX;
    }

    if (Table.isInAlphabeticalOrder(valueB, valueA)) {
      return INCREASE_ELEMENT_A_INDEX;
    }

    return NO_CHANGE;
  };

  static isInAlphabeticalOrder = (valueA, valueB) => valueA.toUpperCase() < valueB.toUpperCase();

  getRow = ({ index }) => this.state.records[index];

  getCellData = (rowData, dataKey) => {
    const cellData = rowData[dataKey];

    if (Table.isTimestamp(dataKey)) {
      return Table.formatTimestamp(cellData);
    }

    return cellData;
  };

  static isTimestamp = dataKey => /timestamp/i.test(dataKey);

  static formatTimestamp = (isoString) => {
    const DATE_FORMAT = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    };

    return new Date(isoString).toLocaleString('en-US', DATE_FORMAT);
  };

  render = () => {
    const columns = this.props.columnDefinitions.map(({ label, dataKey, maxWidth }) => (
      <Column
        key={dataKey}
        label={label}
        dataKey={dataKey}
        width={1}
        maxWidth={maxWidth}
        flexGrow={1}
        flexShrink={1}
        cellDataGetter={({ rowData }) => this.getCellData(rowData, dataKey)}
        headerRenderer={({ sortBy, sortDirection }) => (
          <ColumnHeader
            sortBy={sortBy}
            sortDirection={sortDirection}
            label={label}
            dataKey={dataKey}
          />
        )}
      />
    ));

    return (
      <Wrapper>
        {({ width, height }) => (
          <VirtualizedTable
            width={width}
            height={height}
            headerHeight={38}
            noRowsRenderer={NoRecordsAlert}
            rowHeight={68}
            rowClassName={this.props.handleTableRowClick ? 'hover' : undefined}
            rowCount={this.state.records.length}
            rowGetter={this.getRow}
            sort={this.sortRecords}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
            onRowClick={
              this.props.handleTableRowClick
                ? ({ rowData }) => this.props.handleTableRowClick(rowData)
                : undefined
            }
          >
            {columns}
          </VirtualizedTable>
        )}
      </Wrapper>
    );
  };
}
