import Input from '../components/Input';
import { ipcRenderer } from 'electron';
import React from 'react';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

class AdministrationView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      medication: '',
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

    if (!this.state.datetimeStart || !this.state.datetimeEnd) {
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
      header: {
        type: 'query',
        response: 'query',
      },

      body: {
        table: 'emarAdministration',

        parameters: {
          columns: [
            'emarAdministration.id',
            'timestamp',
            "provider.lastName || ', ' || provider.firstName || ' ' || provider.mi AS provider",
            "medication.name || ', ' || medicationOrder.form AS medication",
            "medicationOrder.dose || ' ' || medicationOrder.units AS dose",
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
              type: '',
              table: 'providerEmar',
              predicate: 'providerEmarId = providerEmar.id',
            },
            {
              type: '',
              table: 'provider',
              predicate: 'providerEmar.providerId = provider.id',
            },
            {
              type: '',
              table: 'medicationOrder',
              predicate: 'medicationOrderId = medicationOrder.id',
            },
            {
              type: '',
              table: 'medication',
              predicate: 'medicationOrder.medicationId = medication.id',
            },
          ],

          orderBys,
        },
      },
    });

    ipcRenderer.once('query', (event, data) =>
      this.setState({ records: data.body })
    );
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
        name: 'Medication',
        orderByColumn: 'medication',
      },
      {
        name: 'Dose',
        orderByColumn: 'dose',
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
              <td className="border-right">{record.medication}</td>
              <td className="border-right">{record.dose}</td>
              <td className="border-right">{record.medicationOrderId}</td>
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
            <h1 className="text-center">Administrations</h1>
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
            <Input
              type="text"
              name="provider"
              value={this.state.provider}
              label="Provider"
              handleChange={this.handleChange}
            />
            <Input
              type="text"
              name="medication"
              value={this.state.medication}
              label="Medication"
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

export default AdministrationView;
