import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';
import { AutoSizer, Column, Table } from 'react-virtualized';

class RecordsTableSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: '',
    };

    this.sort = this.sort.bind(this);
  }

  sort({ sortBy, sortDirection }) {
    if (!this.props.records.length > 0) return;
    const records = [...this.props.records];
    records.sort((recordA, recordB) => {
      if (typeof recordA[sortBy] === 'number') {
        return recordA[sortBy] - recordB[sortBy];
      }

      const recordAString = recordA[sortBy]
        ? recordA[sortBy].toUpperCase()
        : '';
      const recordBString = recordB[sortBy]
        ? recordB[sortBy].toUpperCase()
        : '';
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
      sortedRecords: sortDirection === 'DESC' ? records.reverse() : records,
    });
  }

  render() {
    const columns = this.props.columns.map(
      ({ label, dataKey, width, maxWidth }) => (
        <Column
          key={dataKey}
          label={label}
          dataKey={dataKey}
          width={1}
          maxWidth={maxWidth}
          flexGrow={1}
          flexShrink={1}
          cellDataGetter={({ rowData }) => {
            if (/timestamp/i.test(dataKey)) {
              return new Date(rowData[dataKey]).toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
              });
            }

            return rowData[dataKey];
          }}
          headerRenderer={({ sortBy, sortDirection }) => {
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
          }}
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
                rowHeight={68}
                rowCount={this.props.records.length}
                rowGetter={({ index }) =>
                  this.state.sortedRecords
                    ? this.state.sortedRecords[index]
                    : this.props.records[index]
                }
                sort={this.sort}
                sortBy={this.state.sortBy}
                sortDirection={this.state.sortDirection}
              >
                {columns}
              </Table>
            )}
          </AutoSizer>
        </div>
      </section>
    );
  }
}

export default RecordsTableSection;
