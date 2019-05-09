import { ipcRenderer } from 'electron';
import React from 'react';
import Input from '../components/Input';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

const LedgerView = () => {
  const columnDefinitions = [
    {
      label: 'Withdrawn by',
      dataKey: 'provider',
      maxWidth: 0,
    },
    {
      label: 'Time',
      dataKey: 'timestamp',
      maxWidth: 120,
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
      label: 'Waste',
      dataKey: 'waste',
      maxWidth: 110,
    },
    {
      label: 'Disposition',
      dataKey: 'dispositionType',
      maxWidth: 130,
    },
    {
      label: 'Disposed by',
      dataKey: 'dispositionProvider',
      maxWidth: 0,
    },
    {
      label: 'Time',
      dataKey: 'dispositionTimestamp',
      maxWidth: 120,
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
          <h1 className="text-primary text-center">Ledger</h1>
        </header>
      </div>
      <div className="row">
        <SearchForm />
        <RecordsTableSection
          columnDefinitions={columnDefinitions}
          ipcChannel="ledger"
        />
      </div>
    </React.Fragment>
  );
};

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
      <SearchFormSection
        handleSubmit={this.handleSubmit}
        isSubmitted={this.state.isSubmitted}
      >
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

export default LedgerView;
