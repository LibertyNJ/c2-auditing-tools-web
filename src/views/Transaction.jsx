import { ipcRenderer } from 'electron';
import React from 'react';
import Input from '../components/Input';
import RecordsTableSection from '../components/NewRecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';
import Select from '../components/Select';

const TransactionView = () => (
  <React.Fragment>
    <div className="row flex-shrink-0">
      <header className="col">
        <h1 className="text-primary text-center">Transactions</h1>
      </header>
    </div>
    <div className="row">
      <SearchForm />
      <RecordsTable />
    </div>
  </React.Fragment>
);

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeStart: '',
      datetimeEnd: '',
      transactionTypes: [],
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

    if (target.tagName === 'SELECT') {
      const values = [...target.selectedOptions].map(option => option.value);

      this.setState({ [target.name]: values });
    } else {
      this.setState({ [target.name]: target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (
      this.state.datetimeStart &&
      this.state.datetimeEnd &&
      this.state.transactionTypes.length > 0
    ) {
      ipcRenderer.send('database', {
        header: { type: 'transaction', response: 'transaction' },

        body: {
          datetimeStart: this.state.datetimeStart,
          datetimeEnd: this.state.datetimeEnd,
          transactionTypes: this.state.transactionTypes,
          provider: this.state.provider,
          product: this.state.product,
          medicationOrderId: this.state.medicationOrderId,
        },
      });

      this.setState({ isSubmitted: true });

      ipcRenderer.once('transaction', () =>
        this.setState({ isSubmitted: false })
      );
    }
  }

  render() {
    const transactionTypeOptions = [
      {
        value: 'Restock',
        text: 'Restock',
      },
      {
        value: 'Return',
        text: 'Return',
      },
      {
        value: 'Waste',
        text: 'Waste',
      },
      {
        value: 'Withdrawal',
        text: 'Withdrawal',
      },
    ];

    return (
      <SearchFormSection
        isSubmitted={this.state.isSubmitted}
        handleSubmit={this.handleSubmit}
      >
        <Input
          type="datetime-local"
          name="datetimeStart"
          value={this.state.datetimeStart}
          label="Time start"
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
          label="Time end"
          handleChange={this.handleChange}
          info="Required"
          attributes={{
            max: '9999-12-31T23:59',
            required: true,
          }}
        />
        <Select
          name="transactionTypes"
          value={this.state.transactionTypes}
          label="Transaction types"
          options={transactionTypeOptions}
          handleChange={this.handleChange}
          info="Required, may select multiple options"
          attributes={{
            multiple: true,
            required: true,
          }}
        />
        <Input
          type="text"
          name="provider"
          value={this.state.provider}
          label="Provider"
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
    ipcRenderer.on('transaction', (event, data) => {
      this.setState({ records: data.body, sortColumn: '', sortDirection: '' });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('transaction');
  }

  handleClick(event) {
    if (this.state.records.length > 0) {
      const targetSortColumn = event.target.dataset.sortColumn;

      this.setState(state => {
        const records = [...state.records];

        if (targetSortColumn !== state.sortColumn) {
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
    const columns = [
      {
        label: 'Time',
        dataKey: 'timestamp',
        maxWidth: 120,
      },
      {
        label: 'Provider',
        dataKey: 'provider',
        maxWidth: 0,
      },
      {
        label: 'Transaction',
        dataKey: 'transactionType',
        maxWidth: 130,
      },
      {
        label: 'Product',
        dataKey: 'product',
        maxWidth: 0,
      },
      {
        label: 'Amount',
        dataKey: 'amount',
        maxWidth: 110,
      },
      {
        label: 'Order ID',
        dataKey: 'medicationOrderId',
        maxWidth: 110,
      },
    ];

    return (
      <RecordsTableSection
        sortColumn={this.state.sortColumn}
        sortDirection={this.state.sortDirection}
        columns={columns}
        records={this.state.records}
        handleClick={this.handleClick}
      />
    );
  }
}

export default TransactionView;
