import Input from '../components/Input';
import { ipcRenderer } from 'electron';
import React from 'react';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';
import SVGIcon from '../components/SVGIcon';

class TransactionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      product: '',
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

    const product = this.state.product
      ? {
          column: 'product',
          operator: 'LIKE',
          value: `%${this.state.product}%`,
        }
      : null;

    const provider = this.state.provider
      ? {
          column: 'provider',
          operator: 'LIKE',
          value: `%${this.state.provider}%`,
        }
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
            "provider.lastName || ', ' || provider.firstName || ' ' || provider.mi AS provider",
            'adcTransactionType.name AS transactionType',
            "medication.name || ', ' || medicationProduct.strength || ' ' || medicationProduct.units || ' ' || medicationProduct.form AS product",
            'amount',
            'medicationOrderId',
          ],

          wheres: [
            datetimeEnd,
            datetimeStart,
            provider,
            transactionTypes,
            medicationOrderId,
            product,
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
        orderByColumn: 'provider',
      },
      {
        name: 'Transaction',
        orderByColumn: 'adcTransactionType.name',
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
        name: 'Order ID',
        orderByColumn: 'medicationOrderId',
      },
    ];

    const tableBodyRows =
      this.state.records.length > 0 ? (
        this.state.records.map(record => {
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
              <td className="border-right">{record.provider}</td>
              <td className="border-right">{record.transactionType}</td>
              <td className="border-right">{record.product}</td>
              <td className="border-right">{record.amount}</td>
              <td className="border-right">{record.medicationOrderId}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td className="font-italic text-center border-right" colSpan={6}>
            No records found!
          </td>
        </tr>
      );

    return (
      <React.Fragment>
        <div className="row flex-shrink-0">
          <header className="col">
            <h1 className="text-center">Transactions</h1>
          </header>
        </div>
        <div className="row">
          <SearchFormSection handleSubmit={this.handleSubmit}>
            <Input
              type="datetime-local"
              name="datetimeStart"
              value={this.state.datetimeStart}
              label="Time start"
              handleChange={this.handleChange}
              info="Required"
              max="9999-12-31T23:59"
              required
            />
            <Input
              type="datetime-local"
              name="datetimeEnd"
              value={this.state.datetimeEnd}
              label="Time end"
              handleChange={this.handleChange}
              info="Required"
              max="9999-12-31T23:59"
              required
            />
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
              <small className="form-text text-info">
                <SVGIcon
                  className="align-baseline"
                  type="info-circle"
                  width="1em"
                  height="1em"
                  fill="#17b2a8"
                />{' '}
                Required, may select multiple options
              </small>
            </div>
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

export default TransactionView;
