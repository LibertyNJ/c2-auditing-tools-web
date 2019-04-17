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
      medicationOrderId: '',
      medicationProduct: '',
      provider: '',
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
    event.preventDefault();

    const datetimeEnd = this.state.datetimeEnd;
    const datetimeStart = this.state.datetimeStart;
    const medicationOrderId = this.state.medicationOrderId;
    const medicationProduct = this.state.medicationProduct;
    const provider = this.state.provider;

    ipcRenderer.send('database', {
      header: 'query',
      body: {
        table: 'administration',
        parameters: {
          columns: [
            'providerAdcId',
            'medicationProductId',
            'amount',
            'timestamp',
          ],
          where: {
            timestamp: [
              { operator: '>', value: datetimeStart },
              { operator: '<', value: datetimeEnd },
            ],
            providerAdcId: { operator: '=', value: provider },
            medicationOrderId: {
              operator: 'LIKE',
              value: `%${medicationOrderId}%`,
            },
            medicationProductId: { operator: '=', value: medicationProduct },
          },
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
        name: 'Administered by',
        orderByColumn: 'administeredBy',
      },
      {
        name: 'Time administered',
        orderByColumn: 'timeAdministered',
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
              <td className="border-right">{record.withdrawingProider}</td>
              <td className="border-right">
                {new Date(record.withdrawn).toLocaleString('en-US', {
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
              <td className="border-right">{record.waste}</td>
              <td className="border-right">
                {new Date(record.administered).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                })}
              </td>
              <td className="border-right">{record.administeringProvider}</td>
              <td className="border-right">{record.medicationOrderId}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td className="font-italic text-center border-right" colSpan={8}>
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
              name="timeWithdrawnStart"
              value={this.state.timeWithdrawnStart}
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
              name="timeWithdrawnEnd"
              value={this.state.timeWithdrawnEnd}
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
              value={this.state.withdrawnBy}
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
