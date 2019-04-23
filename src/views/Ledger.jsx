import Input from '../components/Input';
import { ipcRenderer } from 'electron';
import React from 'react';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

class LedgerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeEnd: '',
      datetimeStart: '',
      provider: '',
      medicationOrderId: '',
      medicationProduct: '',

      orderByColumn: '',
      orderByDirection: '',

      records: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleClick(event) {
    const target = event.target;

    this.setState(oldState => {
      const orderByDirection =
        oldState.orderByColumn === target.dataset.orderByColumn &&
        oldState.orderByDirection === 'ASC'
          ? 'DESC'
          : 'ASC';

      return {
        orderByColumn: target.dataset.orderByColumn,
        orderByDirection,
      };
    }, this.handleSubmit);
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
        medicationOrderId: this.state.medicationOrderId,
        medicationProduct: this.state.medicationProduct,
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
        orderByColumn: 'withdrawnBy',
      },
      {
        name: 'Time withdrawn',
        orderByColumn: 'timeWithdrawn',
      },
      {
        name: 'Product',
        orderByColumn: 'product',
      },
      {
        name: 'Amount',
        orderByColumn: 'amount',
      },
      {
        name: 'Waste',
        orderByColumn: 'waste',
      },
      {
        name: 'Disposition',
        orderByColumn: 'disposition',
      },
      {
        name: 'Disposed by',
        orderByColumn: 'disposedBy',
      },
      {
        name: 'Time disposed',
        orderByColumn: 'timeDisposed',
      },
      {
        name: 'Order ID',
        orderByColumn: 'medicationOrderId',
      },
    ];

    const tableBodyRows =
      this.state.records.length > 0 ? (
        this.state.records.map(record => {
          return (
            <tr key={record.id}>
              <td className="border-right">{record.providerName}</td>
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
              <td className="border-right">{record.disposition.type}</td>
              <td className="border-right">
                {record.disposition.providerName}
              </td>
              <td className="border-right">
                {new Date(record.disposition.timestamp).toLocaleString(
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
                )}
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
              name="withdrawnTimeStart"
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
              name="withdrawnTimeEnd"
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
              name="withdrawnBy"
              value={this.state.withdrawingProvider}
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
            orderByColumn={this.state.orderByColumn}
            orderByDirection={this.state.orderByDirection}
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
