import PropTypes from 'prop-types';
import React from 'react';
import { ipcRenderer } from 'electron';

import { AutoSizer, Column, Table } from 'react-virtualized';
import Modal from './Modal';
import SVGIcon from './SVGIcon';

export default class RecordsTableSection extends React.Component {
  state = {
    records: [],
    sortBy: '',
  };

  componentDidMount = () => {
    this.listenForDatabaseCommunication();
  };

  listenForDatabaseCommunication = () => {
    ipcRenderer.on(this.props.ipcChannel, (event, data) => {
      this.setState({ records: data.body, sortBy: '', sortDirection: null });
    });
  };

  componentWillUnmount = () => {
    this.stopListeningForDatabaseCommunication();
  };

  stopListeningForDatabaseCommunication = () => {
    ipcRenderer.removeAllListeners(this.props.ipcChannel);
  };

  sortRecords = ({ sortBy, sortDirection }) => {
    if (this.areNoRecords()) {
      return;
    }

    const records = [...this.state.records];
    records.sort((recordA, recordB) => {
      if (typeof recordA[sortBy] === 'number') {
        return recordA[sortBy] - recordB[sortBy];
      }

      const recordAString = recordA[sortBy].toUpperCase() || '';
      const recordBString = recordB[sortBy].toUpperCase() || '';

      if (recordAString > recordBString) {
        return 1;
      }

      if (recordAString < recordBString) {
        return -1;
      }

      return 0;
    });

    this.setState({
      sortBy,
      sortDirection,
      records: sortDirection === 'DESC' ? records.reverse() : records,
    });
  };

  areNoRecords = () => this.state.records.length === 0;

  toggleModal = () => {
    this.setState(state => {
      return { modalIsShown: !state.modalIsShown };
    });
  };

  handleRowClick = rowData => {
    this.setState({ selectedProviderId: rowData.id }, this.toggleModal);
  };

  render = () => {
    const getCellData = (rowData, dataKey) => {
      const cellData = rowData[dataKey];
      if (/timestamp/i.test(dataKey)) {
        return cellData
          ? new Date(cellData).toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false,
            })
          : null;
      }

      return cellData;
    };

    const renderHeader = (sortBy, sortDirection, label, dataKey) => {
      const getSortIconType = () => {
        if (sortBy === dataKey) {
          switch (sortDirection) {
            case 'ASC':
              return 'sort-up';
            case 'DESC':
              return 'sort-down';
            default:
              return 'sort';
          }
        }

        return 'sort';
      };

      return (
        <span
          className="ReactVirtualized__Table__headerTruncatedText"
          title={label}
        >
          {label}
          &nbsp;
          <SVGIcon
            className="align-baseline"
            type={getSortIconType()}
            width="1em"
            height="1em"
            fill="#53565a"
          />
        </span>
      );
    };

    const renderNoRows = () => (
      <div
        className="alert alert-info text-center w-50 mx-auto mt-5"
        role="alert"
      >
        <span className="font-weight-bold">No records found!</span>
        <br />
        Use the form on the left to begin a new search.
      </div>
    );

    const columns = this.props.columnDefinitions.map(
      ({ label, dataKey, maxWidth }) => (
        <Column
          key={dataKey}
          label={label}
          dataKey={dataKey}
          width={1}
          maxWidth={maxWidth}
          flexGrow={1}
          flexShrink={1}
          cellDataGetter={({ rowData }) => getCellData(rowData, dataKey)}
          headerRenderer={({ sortBy, sortDirection }) =>
            renderHeader(sortBy, sortDirection, label, dataKey)
          }
        />
      )
    );

    return (
      <section className="col-9 d-flex flex-column">
        <header>
          <h2 className="text-primary">Records</h2>
        </header>
        <div className="h-100">
          <AutoSizer>
            {({ width, height }) => (
              <Table
                width={width}
                height={height}
                headerHeight={38}
                noRowsRenderer={renderNoRows}
                rowHeight={68}
                rowClassName={this.props.modalIsEnabled ? 'hover' : null}
                rowCount={this.state.records.length}
                rowGetter={({ index }) => this.state.records[index]}
                sort={this.sortRecords}
                sortBy={this.state.sortBy}
                sortDirection={this.state.sortDirection}
                onRowClick={
                  this.props.modalIsEnabled
                    ? ({ rowData }) => this.handleRowClick(rowData)
                    : null
                }
              >
                {columns}
              </Table>
            )}
          </AutoSizer>
        </div>
        {this.props.modalIsEnabled && (
          <Modal
            providerId={this.state.selectedProviderId}
            isShown={this.state.modalIsShown}
            toggleModal={this.toggleModal}
            formRef={this.props.formRef}
          />
        )}
      </section>
    );
  };
}

RecordsTableSection.propTypes = {
  columnDefinitions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      dataKey: PropTypes.string,
      maxWidth: PropTypes.number,
    })
  ).isRequired,
  ipcChannel: PropTypes.string.isRequired,
  modalIsEnabled: PropTypes.bool,
};

RecordsTableSection.defaultProps = {
  modalIsEnabled: false,
};
