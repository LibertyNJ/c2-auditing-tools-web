import { ipcRenderer } from 'electron';
import React from 'react';

class TransactionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      medication: '',
      provider: '',
      transactionTypes: [],
      orderByColumn: '',
      orderByDirection: '',

      records: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {}

  handleChange(event) {
    const target = event.target;

    if (target.tagName === 'SELECT') {
      const values = [...target.selectedOptions].map(option => option.value);
      this.setState({ [target.name]: values });
    } else {
      this.setState({ [target.name]: target.value });
    }
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

    if (
      !this.state.datetimeStart ||
      !this.state.datetimeEnd ||
      this.state.transactionTypes.length === 0
    ) {
      return;
    }

    const datetimeEnd = this.state.datetimeEnd
      ? { column: 'timestamp', operator: '<', value: this.state.datetimeEnd }
      : null;

    const datetimeStart = this.state.datetimeStart
      ? { column: 'timestamp', operator: '>', value: this.state.datetimeStart }
      : null;

    const medicationOrderId = this.state.medicationOrderId
      ? {
          column: 'medicationOrderId',
          operator: 'LIKE',
          value: `%${this.state.medicationOrderId}%`,
        }
      : null;

    const medication = this.state.medication
      ? {
          column: 'medication.name',
          operator: 'LIKE',
          value: `%${this.state.medication}%`,
        }
      : null;

    const providerAdcId = this.state.provider
      ? { column: 'providerAdcId', operator: '=', value: this.state.provider }
      : null;

    const transactionTypes = this.state.transactionTypes
      ? this.state.transactionTypes.map(transactionType => {
          return {
            column: 'adcTransactionType.name',
            operator: '=',
            value: transactionType,
          };
        })
      : null;

    const orderBys = this.state.orderByColumn
      ? [
          {
            column: this.state.orderByColumn,
            direction: this.state.orderByDirection,
          },
        ]
      : null;

    ipcRenderer.send('database', {
      header: 'query',

      body: {
        table: 'adcTransaction',

        parameters: {
          columns: [
            'adcTransaction.id',
            'timestamp',
            'provider.lastName',
            'provider.firstName',
            'provider.mi',
            'adcTransactionType.name AS transactionType',
            'medication.name AS medication',
            'medicationProduct.strength',
            'medicationProduct.units',
            'medicationProduct.form',
            'amount',
            'medicationOrderId',
          ],

          wheres: [
            datetimeEnd,
            datetimeStart,
            providerAdcId,
            transactionTypes,
            medicationOrderId,
            medication,
          ],

          joins: [
            {
              table: 'providerAdc',
              predicate: 'providerAdcId = providerAdc.id',
            },
            {
              table: 'provider',
              predicate: 'providerAdc.providerId = provider.id',
            },
            {
              table: 'medicationProduct',
              predicate: 'medicationProductId = medicationProduct.id',
            },
            {
              table: 'medication',
              predicate: 'medicationProduct.medicationId = medication.id',
            },
            {
              table: 'adcTransactionType',
              predicate: 'typeId = adcTransactionType.id',
            },
          ],

          orderBys,
        },
      },
    });

    ipcRenderer.once('query', (event, data) => {
      if (data.header === 'query') {
        this.setState({ records: data.body });
      }
    });
  }

  render() {
    const columnHeadings = [
      {
        name: 'Time',
        orderByColumn: 'timestamp',
      },
      {
        name: 'Provider',
        orderByColumn: 'provider.lastName',
      },
      {
        name: 'Transaction',
        orderByColumn: 'adcTransactionType.name',
      },
      {
        name: 'Product',
        orderByColumn: 'medication.name',
      },
      {
        name: 'Amount',
        orderByColumn: 'amount',
      },
      {
        name: 'Order ID',
        orderByColumn: 'medicationOrderId',
      },
    ];

    const tableHeadHeadings = columnHeadings.map(columnHeading => {
      let sortImgSrc = './assets/icons/sort.svg';

      if (columnHeading.orderByColumn === this.state.orderByColumn) {
        if (this.state.orderByDirection === 'ASC') {
          sortImgSrc = './assets/icons/sort-up.svg';
        } else {
          sortImgSrc = './assets/icons/sort-down.svg';
        }
      }

      return (
        <th
          key={columnHeading.name}
          className="sticky-top bg-white p-0 border-top-0 border-bottom-0 border-right"
          scope="col"
        >
          <button
            className="btn btn-link text-reset font-weight-bold d-block w-100 h-100 border-bottom rounded-0"
            type="button"
            data-order-by-column={columnHeading.orderByColumn}
            onClick={this.handleClick}
          >
            {columnHeading.name}&nbsp;
            <img
              className="img-fluid"
              src={sortImgSrc}
              alt="Sort"
              style={{ maxHeight: '1rem', maxWidth: '1rem' }}
            />
          </button>
        </th>
      );
    });

    const tableBodyRows = this.state.records.map(record => {
      return (
        <tr key={record.id}>
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
          <td className="border-right">
            {record.lastName}, {record.firstName} {record.mi}
          </td>
          <td className="border-right">{record.transactionType}</td>
          <td className="border-right">
            {record.medication} {record.strength} {record.units} {record.form}
          </td>
          <td className="border-right">{record.amount}</td>
          <td className="border-right">{record.medicationOrderId}</td>
        </tr>
      );
    });

    return (
      <React.Fragment>
        <div className="row flex-shrink-0">
          <header className="col">
            <h1 className="text-center">Transactions</h1>
          </header>
        </div>
        <div className="row">
          <section className="col-3 d-flex flex-column mb-3">
            <header>
              <h2>Parameters</h2>
            </header>
            <form
              className="form overflow-auto pr-3"
              onSubmit={this.handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="datetimeStart">Start time</label>
                <input
                  id="datetimeStart"
                  className="form-control"
                  type="datetime-local"
                  name="datetimeStart"
                  value={this.state.datetimeStart}
                  max="9999-12-31T23:59"
                  required
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="datetimeEnd">End time</label>
                <input
                  id="datetimeEnd"
                  className="form-control"
                  type="datetime-local"
                  name="datetimeEnd"
                  value={this.state.datetimeEnd}
                  max="9999-12-31T23:59"
                  required
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="transactionTypes">Transaction types</label>
                <select
                  id="transactionTypes"
                  className="custom-select"
                  type="text"
                  name="transactionTypes"
                  value={this.state.transactionTypes}
                  multiple
                  required
                  onChange={this.handleChange}
                >
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Waste">Waste</option>
                  <option value="Restock">Restock</option>
                  <option value="Return">Return</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="provider">Provider</label>
                <input
                  id="provider"
                  className="form-control"
                  type="text"
                  name="provider"
                  value={this.state.provider}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="medicationOrderId">Order ID</label>
                <input
                  id="medicationOrderId"
                  className="form-control"
                  type="text"
                  name="medicationOrderId"
                  value={this.state.medicationOrderId}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="medication">Medication</label>
                <input
                  id="medication"
                  className="form-control"
                  type="text"
                  name="medication"
                  value={this.state.medication}
                  onChange={this.handleChange}
                />
              </div>
              <button className="btn btn-primary d-block ml-auto" type="submit">
                Search
              </button>
            </form>
          </section>
          <section className="col-9 d-flex flex-column mb-3">
            <h2>Results</h2>
            <div className="overflow-auto border">
              <table className="table table-sm mb-0">
                <thead>
                  <tr className="border-0">{tableHeadHeadings}</tr>
                </thead>
                <tbody>{tableBodyRows}</tbody>
              </table>
            </div>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default TransactionView;
