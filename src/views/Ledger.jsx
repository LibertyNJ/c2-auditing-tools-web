import { ipcRenderer } from 'electron';
import React from 'react';
import Input from '../components/Input';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

const LedgerView = () => (
  <React.Fragment>
    <div className="row flex-shrink-0">
      <header className="col">
        <h1 className="text-center">Ledger</h1>
      </header>
    </div>
    <div className="row">
      <SearchForm />
      <RecordsTable />
    </div>
  </React.Fragment>
);

class SearchForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      datetimeStart: '',
      datetimeEnd: '',
      provider: '',
      product: '',
      medicationOrderId: '',
      isSubmitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.datetimeStart && this.state.datetimeEnd) {
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

      this.setState({ isSubmitted: true });

      ipcRenderer.once('ledger', () => {
        this.setState({ isSubmitted: false });
      });
    }
  }

  render() {
    return (
      <SearchFormSection handleSubmit={this.handleSubmit} isSubmitted={this.state.isSubmitted}>
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
    );
  }
}

class RecordsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      sortColumn: '',
      sortDirection: '',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('ledger', (event, data) => {
      this.setState({ records: data.body, sortColumn: '', sortDirection: '' });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('ledger');
  }

  handleClick(event) {
    if (this.state.records.length > 0) {
      const targetSortColumn = event.target.dataset.sortColumn;

      this.setState((state) => {
        const records = [...state.records];

        if (targetSortColumn !== this.state.sortColumn) {
          records.sort((recordA, recordB) => {
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

          return {
            sortColumn: targetSortColumn,
            sortDirection: 'ASC',
            records,
          };
        }

        if (state.sortDirection === 'ASC') {
          return {
            sortDirection: 'DESC',
            records: records.reverse(),
          };
        }

        return {
          sortDirection: 'ASC',
          records: records.reverse(),
        };
      });
    }
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
        sortColumn: 'waste',
      },
      {
        name: 'Disposition',
        sortColumn: 'dispositionType',
      },
      {
        name: 'Disposed by',
        sortColumn: 'dispositionProvider',
      },
      {
        name: 'Time disposed',
        sortColumn: 'dispositionTimestamp',
      },
      {
        name: 'Order ID',
        sortColumn: 'medicationOrderId',
      },
    ];

    const tableBodyRows =
      this.state.records.length > 0 ? (
        this.state.records.map(record => (
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
            <td className="border-right">{record.waste ? record.waste : ''}</td>
            <td className="border-right">{record.dispositionType ? record.dispositionType : ''}</td>
            <td className="border-right">
              {record.dispositionProvider ? record.dispositionProvider : ''}
            </td>
            <td className="border-right">
              {record.dispositionTimestamp
                ? new Date(record.dispositionTimestamp).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                })
                : ''}
            </td>
            <td className="border-right">{record.medicationOrderId}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td className="font-italic text-center border-right" colSpan={9}>
            No records found!
          </td>
        </tr>
      );

    return (
      <RecordsTableSection
        sortColumn={this.state.sortColumn}
        sortDirection={this.state.sortDirection}
        columnHeadings={columnHeadings}
        tableBodyRows={tableBodyRows}
        handleClick={this.handleClick}
      />
    );
  }
}

export default LedgerView;
