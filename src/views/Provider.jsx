import { ipcRenderer } from 'electron';
import React from 'react';
import Input from '../components/Input';
import Modal from '../components/Modal';
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
      records: [],
      sortColumn: '',
      sortDirection: '',
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
      if (this.state.records.length === 0) {
        return;
      }

      const targetSortColumn = event.target.dataset.sortColumn;

      this.setState(state => {
        const records = [...state.records];

        if (targetSortColumn !== this.state.sortColumn) {
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

  handleSubmit(event) {
    event.preventDefault();

    ipcRenderer.send('database', {
      header: {
        type: 'provider',
        response: 'provider',
      },

      body: {
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        middleInitial: this.state.middleInitial,
        adcId: this.state.adcId,
        emarId: this.state.emarId,
      },
    });

    ipcRenderer.once('provider', (event, data) => {
      this.setState({ records: data.body, sortColumn: '', sortDirection: '' })
    });
  }

  render() {
    const columnHeadings = [
      {
        name: 'Last name',
        sortColumn: 'lastName',
      },
      {
        name: 'First name',
        sortColumn: 'firstName',
      },
      {
        name: 'MI',
        sortColumn: 'middleInitial',
      },
      {
        name: 'ADC IDs',
        sortColumn: 'adcId',
      },
      {
        name: 'EMAR IDs',
        sortColumn: 'emarId',
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
            sortColumn={this.state.sortColumn}
            sortDirection={this.state.sortDirection}
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
