import Input from '../components/Input';
import { ipcRenderer } from 'electron';
import Modal from '../components/Modal';
import React from 'react';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

class ProviderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastName: '',
      firstName: '',
      middleInitial: '',
      adcId: '',
      emarId: '',
      orderByColumn: '',
      orderByDirection: '',

      selectedProviderId: '',

      records: [],
    };

    this.modalRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleClick(event) {
    const target = event.target;

    if (target.tagName === 'TD') {
      const currentTarget = event.currentTarget;
      
      this.setState(
        { selectedProviderId: currentTarget.dataset.providerId },
        this.modalRef.current.handleShow
      );
    } else {
      this.setState(state => {
        const orderByDirection =
          state.orderByColumn === target.dataset.orderByColumn &&
          state.orderByDirection === 'ASC'
            ? 'DESC'
            : 'ASC';

        return {
          orderByColumn: target.dataset.orderByColumn,
          orderByDirection,
        };
      }, this.handleSubmit);
    }
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const lastName = this.state.lastName
      ? {
          column: 'lastName',
          operator: 'LIKE',
          value: `%${this.state.lastName}%`,
        }
      : null;

    const firstName = this.state.firstName
      ? {
          column: 'firstName',
          operator: 'LIKE',
          value: `%${this.state.firstName}%`,
        }
      : null;

    const middleInitial = this.state.middleInitial
      ? {
          column: 'middleInitial',
          operator: 'LIKE',
          value: `%${this.state.middleInitial}%`,
        }
      : null;

    const adcId = this.state.adcId
      ? {
          column: 'providerAdc.name',
          operator: 'LIKE',
          value: `%${this.state.adcId}%`,
        }
      : null;

    const emarId = this.state.emarId
      ? {
          column: 'providerEmar.name',
          operator: 'LIKE',
          value: `%${this.state.emarId}%`,
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
        table: 'provider',

        parameters: {
          isDistinct: true,

          columns: [
            'provider.id',
            'lastName',
            'firstName',
            'middleInitial',
            "(SELECT group_concat(name, '; ') FROM providerAdc WHERE providerId = provider.id) AS adcId",
            "(SELECT group_concat(name, '; ') FROM providerEmar WHERE providerId = provider.id) AS emarId",
          ],

          wheres: [lastName, firstName, middleInitial, adcId, emarId],

          joins: [
            {
              type: 'LEFT',
              table: 'providerAdc',
              predicate: 'provider.id = providerAdc.providerId',
            },
            {
              type: 'LEFT',
              table: 'providerEmar',
              predicate: 'provider.id = providerEmar.providerId',
            },
          ],

          orderBys,
        },
      },
    });

    ipcRenderer.once('query', (event, data) => {
      this.setState({ records: data.body });
    });
  }

  render() {
    const columnHeadings = [
      {
        name: 'Last name',
        orderByColumn: 'lastName',
      },
      {
        name: 'First name',
        orderByColumn: 'firstName',
      },
      {
        name: 'MI',
        orderByColumn: 'middleInitial',
      },
      {
        name: 'ADC IDs',
        orderByColumn: 'adcId',
      },
      {
        name: 'EMAR IDs',
        orderByColumn: 'emarId',
      },
    ];

    const tableBodyRows =
      this.state.records.length > 0 ? (
        this.state.records.map(record => {
          return (
            <tr
              key={record.id}
              data-provider-id={record.id}
              data-toggle="modal"
              data-target="#modal"
              onClick={this.handleClick}
            >
              <td className="border-right">{record.lastName}</td>
              <td className="border-right">{record.firstName}</td>
              <td className="border-right">{record.middleInitial}</td>
              <td className="border-right">{record.adcId}</td>
              <td className="border-right">{record.emarId}</td>
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
              name="middleInitial"
              value={this.state.middleInitial}
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
            className="table-hover"
          />
        </div>
        <Modal
          ref={this.modalRef}
          providerId={this.state.selectedProviderId}
          refreshView={this.handleSubmit}
        />
      </React.Fragment>
    );
  }
}

export default ProviderView;
