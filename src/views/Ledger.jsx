import { ipcRenderer } from 'electron';
import React from 'react';
import Input from '../components/Input';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

class LedgerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeStart: '',
      datetimeEnd: '',
      provider: '',
      product: '',
      medicationOrderId: '',
      records: [],
      sortColumn: '',
      sortDirection: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleClick(event) {
    if (this.state.records.length === 0) {
      return;
    }

    const targetSortColumn = event.target.dataset.sortColumn;

    this.setState(state => {
      const records = [...state.records].sort((recordA, recordB) => {
        if (typeof recordA[targetSortColumn] === 'number') {
          return recordA[targetSortColumn] - recordB[targetSortColumn];
        }

        const recordAString = recordA[targetSortColumn]
          ? recordA[targetSortColumn].toLowerCase()
          : '';

        const recordBString = recordB[targetSortColumn]
          ? recordB[targetSortColumn].toLowerCase()
          : '';

        if (recordAString > recordBString) {
          return 1;
        }

        if (recordAString < recordBString) {
          return -1;
        }

        return 0;
      });

      if (
        state.sortColumn === targetSortColumn &&
        state.sortDirection === 'ASC'
      ) {
        return {
          sortColumn: targetSortColumn,
          sortDirection: 'DESC',
          records: records.reverse(),
        };
      }

      return {
        sortColumn: targetSortColumn,
        sortDirection: 'ASC',
        records,
      };
    });
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.state.datetimeStart || !this.state.datetimeEnd) {
      return;
    }

    ipcRenderer.send('database', {
      header: { type: 'ledger', response: 'ledger' },

      body: {
        datetimeStart: this.state.datetimeStart,
        datetimeEnd: this.state.datetimeEnd,
        provider: this.state.provider,
        product: this.state.product,
        medicationOrderId: this.state.medicationOrderId,
      },
    });

    ipcRenderer.once('ledger', (event, data) => {
      this.setState({ records: data.body });
    });
  }

  render() {
    const columnHeadings = [
      {
        name: 'Withdrawn by',
        sortColumn: 'provider',
      },
      {
        name: 'Time withdrawn',
        sortColumn: 'timestamp',
      },
      {
        name: 'Product',
        sortColumn: 'product',
      },
      {
        name: 'Amount',
        sortColumn: 'amount',
      },
      {
        name: 'Waste',
        sortColumn: 'waste.amount',
      },
      {
        name: 'Disposition',
        sortColumn: 'disposition.type',
      },
      {
        name: 'Disposed by',
        sortColumn: 'disposedBy',
      },
      {
        name: 'Time disposed',
        sortColumn: 'disposition.timestamp',
      },
      {
        name: 'Order ID',
        sortColumn: 'medicationOrderId',
      },
    ];

    const tableBodyRows =
      this.state.records.length > 0 ? (
        this.state.records.map(record => {
          return (
            <tr key={record.id}>
              <td className="border-right">{record.provider}</td>
              <td className="border-right">
                {new Date(record.timestamp).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                })}
              </td>
              <td className="border-right">{record.product}</td>
              <td className="border-right">{record.amount}</td>
              <td className="border-right">
                {record.waste ? record.waste.amount : ''}
              </td>
              <td className="border-right">
                {record.disposition ? record.disposition.type : ''}
              </td>
              <td className="border-right">
                {record.disposition ? record.disposition.provider : ''}
              </td>
              <td className="border-right">
                {record.disposition
                  ? new Date(record.disposition.timestamp).toLocaleString(
                      'en-US',
                      {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: false,
                      }
                    )
                  : ''}
              </td>
              <td className="border-right">{record.medicationOrderId}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td className="font-italic text-center border-right" colSpan={9}>
            No records found!
          </td>
        </tr>
      );

    return (
      <React.Fragment>
        <div className="row flex-shrink-0">
          <header className="col">
            <h1 className="text-center">Ledger</h1>
          </header>
        </div>
        <div className="row">
          <SearchFormSection handleSubmit={this.handleSubmit}>
            <Input
              type="datetime-local"
              name="datetimeStart"
              value={this.state.datetimeStart}
              label="Time withdrawn start"
              handleChange={this.handleChange}
              info="Required"
              attributes={{
                max: '9999-12-31T23:59',
                required: true,
              }}
            />
            <Input
              type="datetime-local"
              name="datetimeEnd"
              value={this.state.datetimeEnd}
              label="Time withdrawn end"
              handleChange={this.handleChange}
              info="Required"
              attributes={{
                max: '9999-12-31T23:59',
                required: true,
              }}
            />
            <Input
              type="text"
              name="provider"
              value={this.state.provider}
              label="Withdrawn by"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="product"
              value={this.state.product}
              label="Product"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="medicationOrderId"
              value={this.state.medicationOrderId}
              label="Order ID"
              handleChange={this.handleChange}
            />
          </SearchFormSection>
          <RecordsTableSection
            sortColumn={this.state.sortColumn}
            sortDirection={this.state.sortDirection}
            columnHeadings={columnHeadings}
            tableBodyRows={tableBodyRows}
            handleClick={this.handleClick}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default LedgerView;
