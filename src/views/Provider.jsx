import Input from '../components/Input';
import { ipcRenderer } from 'electron';
import React from 'react';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

class ProviderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastName: '',
      firstName: '',
      mi: '',
      adcId: '',
      emarId: '',
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
          column: 'medication',
          operator: 'LIKE',
          value: `%${this.state.medication}%`,
        }
      : null;

    const provider = this.state.provider
      ? {
          column: 'provider',
          operator: 'LIKE',
          value: `%${this.state.provider}%`,
        }
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
        table: 'provider',

        parameters: {
          columns: [
            'timestamp',
            "provider.lastName || ', ' || provider.firstName || ' ' || provider.mi AS provider",
            "medication.name || ', ' || medicationProduct.strength || ' ' || medicationProduct.units || ' ' || medicationProduct.form AS medication",
            'amount',
            'medicationOrderId',
          ],

          wheres: [
            datetimeEnd,
            datetimeStart,
            provider,
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
        name: 'Last',
        orderByColumn: 'lastName',
      },
      {
        name: 'First',
        orderByColumn: 'firstName',
      },
      {
        name: 'MI',
        orderByColumn: 'mi',
      },
      {
        name: 'ADC IDs',
        orderByColumn: '',
      },
      {
        name: 'EMAR IDs',
        orderByColumn: '',
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
              <td className="border-right">{record.medication}</td>
              <td className="border-right">{record.medication}</td>
              <td className="border-right">{record.medication}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td className="font-italic text-center border-right" colSpan={5}>
            No records found!
          </td>
        </tr>
      );

    return (
      <React.Fragment>
        <div className="row flex-shrink-0">
          <header className="col">
            <h1 className="text-center">Providers</h1>
          </header>
        </div>
        <div className="row">
          <SearchFormSection handleSubmit={this.handleSubmit}>
            <Input
              type="text"
              name="lastName"
              value={this.state.lastName}
              label="Last name"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="firstName"
              value={this.state.firstName}
              label="First name"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="mi"
              value={this.state.mi}
              label="Middle initial"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="adcId"
              value={this.state.adcId}
              label="ADC ID"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="emarId"
              value={this.state.emarId}
              label="EMAR ID"
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

export default ProviderView;
