import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from './IconButton';
import Input from './Input';
import Select from './Select';
import SVGIcon from './SVGIcon';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      lastName: '',
      firstName: '',
      middleInitial: '',
      adcIds: [],
      emarIds: [],

      addAdcId: '0',
      addEmarId: '0',

      providerAdcs: [],
      providerEmars: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const tables = ['providerAdc', 'providerEmar'];

    tables.forEach(table => {
      ipcRenderer.send('database', {
        header: {
          type: 'query',
          response: table,
        },

        body: {
          table,

          parameters: {
            columns: ['id', 'name'],

            wheres: [],

            orderBys: [
              {
                column: 'name',
                direction: 'ASC',
              },
            ],
          },
        },
      });

      ipcRenderer.once(table, (event, data) => {
        this.setState({ [`${table}s`]: data.body });
      });
    });
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleReset(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      lastName: this.props.editRecord.lastName,
      firstName: this.props.editRecord.firstName,
      middleInitial: this.props.editRecord.middleInitial,
      adcIds: this.props.editRecord.adcIds,
      emarIds: this.props.editRecord.emarIds,

      addAdcId: '0',
      addEmarId: '0',
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const lastName = this.state.lastName
      ? {
          column: 'lastName',
          value: this.state.lastName,
        }
      : null;

    const firstName = this.state.firstName
      ? {
          column: 'firstName',
          value: this.state.firstName,
        }
      : null;

    const middleInitial = this.state.middleInitial
      ? {
          column: 'middleInital',
          value: this.state.middleInitial,
        }
      : null;

    const id = this.state.id
      ? {
          column: 'id',
          operator: '=',
          value: this.state.id,
        }
      : null;

    ipcRenderer.send('database', {
      header: {
        type: 'update',
        response: 'update',
      },
      body: {
        sets: [lastName, firstName, middleInitial],
        wheres: [id],
      },
    });

    ipcRenderer.once('update', (event, data) => alert(data.body));
  }

  render() {
    const adcIds = this.props.editRecord.adcIds.map(adcId => (
      <li key={adcId} className="list-group-item list-group-item-action">
        {adcId}
      </li>
    ));

    const emarIds = this.props.editRecord.emarIds.map(emarId => (
      <li key={emarId} className="list-group-item list-group-item-action">
        {emarId}
      </li>
    ));

    const providerAdcs = this.state.providerAdcs.map(({ id, name }) => {
      return {
        value: id,
        text: name,
      };
    });

    providerAdcs.unshift({
      value: 0,
      text: '',
    });

    const providerEmars = this.state.providerEmars.map(({ id, name }) => {
      return {
        value: id,
        text: name,
      };
    });

    providerEmars.unshift({
      value: 0,
      text: '',
    });

    return (
      <div
        id="modal"
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <form className="modal-content" onReset={this.handleReset}>
            <header className="modal-header">
              <h3 className="modal-title">Edit provider</h3>
              <div className="p-3">
                <button
                  type="button"
                  className="close p-0"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <SVGIcon
                    className="align-baseline"
                    type="window-close"
                    width="1em"
                    height="1em"
                    fill="red"
                  />
                </button>
              </div>
            </header>
            <div className="modal-body">
              <p className="lead">
                {this.props.editRecord.lastName},{' '}
                {this.props.editRecord.firstName}{' '}
                {this.props.editRecord.middleInitial}
              </p>
              <div className="form-row">
                <section className="col">
                  <h4>Name</h4>
                  <div className="form-row">
                    <div className="col-5">
                      <Input
                        type="text"
                        name="editLastName"
                        value={this.state.lastName}
                        label="Last"
                        handleChange={this.handleChange}
                      />
                    </div>
                    <div className="col-5">
                      <Input
                        type="text"
                        name="editFirstName"
                        value={this.state.firstName}
                        label="First"
                        handleChange={this.handleChange}
                      />
                    </div>
                    <div className="col-2">
                      <Input
                        type="text"
                        name="editMi"
                        value={this.state.middleInitial}
                        label="MI"
                        handleChange={this.handleChange}
                      />
                    </div>
                  </div>
                </section>
              </div>
              <div className="form-row">
                <section className="col">
                  <h4>ADC IDs</h4>
                  {adcIds.length > 0 && (
                    <ul className="list-group mb-1">{adcIds}</ul>
                  )}
                  <Select
                    name="addAdcId"
                    value={this.state.addAdcId}
                    label="Add ADC ID"
                    options={providerAdcs}
                    handleChange={this.handleChange}
                  />
                </section>
                <section className="col">
                  <h4>EMAR IDs</h4>
                  {emarIds.length > 0 && (
                    <ul className="list-group mb-1">{emarIds}</ul>
                  )}
                  <Select
                    name="addEmarId"
                    value={this.state.addEmarId}
                    label="Add EMAR ID"
                    options={providerEmars}
                    handleChange={this.handleChange}
                  />
                </section>
              </div>
            </div>
            <footer className="modal-footer">
              <IconButton
                type="submit"
                text="Save"
                color="primary"
                icon="save"
              />
              <IconButton
                type="reset"
                text="Reset"
                color="secondary"
                icon="undo"
              />
            </footer>
          </form>
        </div>
      </div>
    );
  }
}

export default Modal;
