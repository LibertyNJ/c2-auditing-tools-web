import { ipcRenderer } from 'electron';
import React from 'react';
import Input from '../components/Input';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';
import Select from '../components/Select';

const TransactionView = () => {
  const columnDefinitions = [
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
    <React.Fragment>
      <div className="row flex-shrink-0">
        <header className="col">
          <h1 className="text-primary text-center">Transactions</h1>
        </header>
      </div>
      <div className="row">
        <SearchForm />
        <RecordsTableSection
          columnDefinitions={columnDefinitions}
          ipcChannel="transaction"
        />
      </div>
    </React.Fragment>
  );
};

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

export default TransactionView;
