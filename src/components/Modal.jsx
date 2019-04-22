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
      lastName: '',
      firstName: '',
      middleInitial: '',

      adcIds: [],
      emarIds: [],

      editLastName: '',
      editFirstName: '',
      editMiddleInitial: '',

      addAdcId: '0',
      addEmarId: '0',

      removeAdcIds: [],
      removeEmarIds: [],

      providerAdcs: [],
      providerEmars: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleClick(event) {
    const target = event.target;
    const name = `remove${target.dataset.idType}Ids`;
    const value = target.dataset.id;

    this.setState(state => {
      if (state[name].includes(value)) {
        return { [name]: [...state[name].filter(item => item !== value)] };
      }

      return { [name]: [...state[name], value] };
    });
  }

  handleClose() {
    this.handleReset();
  }

  handleReset(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      editLastName: this.state.lastName,
      editFirstName: this.state.firstName,
      editMiddleInitial: this.state.middleInitial,

      addAdcId: '0',
      addEmarId: '0',

      removeAdcIds: [],
      removeEmarIds: [],
    });
  }

  handleShow() {
    this.getProviderData();
    this.getUnassignedIds();
  }

  handleSubmit(event) {
    event.preventDefault();

    const lastName = {
      column: 'lastName',
      value: this.state.editLastName,
    };

    const firstName = {
      column: 'firstName',
      value: this.state.editFirstName,
    };

    const middleInitial = {
      column: 'middleInitial',
      value: this.state.editMiddleInitial,
    };

    const id = this.props.providerId
      ? {
          column: 'id',
          operator: '=',
          value: this.props.providerId,
        }
      : null;

    if (this.state.addAdcId > 0) {
      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },
        body: {
          table: 'providerAdc',
          parameters: {
            sets: [{ column: 'providerId', value: this.props.providerId }],
            wheres: [
              { column: 'id', operator: '=', value: this.state.addAdcId },
            ],
          },
        },
      });
    }

    if (this.state.addEmarId > 0) {
      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },
        body: {
          table: 'providerEmar',
          parameters: {
            sets: [{ column: 'providerId', value: this.props.providerId }],
            wheres: [
              { column: 'id', operator: '=', value: this.state.addEmarId },
            ],
          },
        },
      });
    }

    if (this.state.removeAdcIds.length > 0) {
      const removeAdcIds = this.state.removeAdcIds.map(removeAdcId => {
        return {
          column: 'name',
          operator: '=',
          value: removeAdcId,
        };
      });

      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },
        body: {
          table: 'providerAdc',
          parameters: {
            sets: [{ column: 'providerId', value: null }],
            wheres: [removeAdcIds],
          },
        },
      });
    }

    if (this.state.removeEmarIds.length > 0) {
      const removeEmarIds = this.state.removeEmarIds.map(removeEmarId => {
        return {
          column: 'name',
          operator: '=',
          value: removeEmarId,
        };
      });

      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },
        body: {
          table: 'providerEmar',
          parameters: {
            sets: [{ column: 'providerId', value: null }],
            wheres: [removeEmarIds],
          },
        },
      });
    }

    ipcRenderer.send('database', {
      header: {
        type: 'update',
        response: 'update',
      },
      body: {
        table: 'provider',
        parameters: {
          sets: [lastName, firstName, middleInitial],
          wheres: [id],
        },
      },
    });

    ipcRenderer.once('update', (event, data) => {
      this.getProviderData();
      this.getUnassignedIds();
      this.handleReset();
    });
  }

  getProviderData() {
    ipcRenderer.send('database', {
      header: {
        type: 'query',
        response: 'provider',
      },

      body: {
        table: 'provider',

        parameters: {
          isDistinct: true,

          columns: [
            'lastName',
            'firstName',
            'middleInitial',
            "(SELECT group_concat(name, '; ') FROM providerAdc WHERE providerId = provider.id) AS adcIds",
            "(SELECT group_concat(name, '; ') FROM providerEmar WHERE providerId = provider.id) AS emarIds",
          ],

          wheres: [
            {
              column: 'provider.id',
              operator: '=',
              value: this.props.providerId,
            },
          ],

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
        },
      },
    });

    ipcRenderer.once('provider', (event, data) => {
      const adcIds = data.body[0].adcIds ? data.body[0].adcIds.split('; ') : [];
      const emarIds = data.body[0].emarIds
        ? data.body[0].emarIds.split('; ')
        : [];

      this.setState({
        lastName: data.body[0].lastName,
        firstName: data.body[0].firstName,
        middleInitial: data.body[0].middleInitial,
        adcIds,
        emarIds,

        editLastName: data.body[0].lastName,
        editFirstName: data.body[0].firstName,
        editMiddleInitial: data.body[0].middleInitial,

        addAdcId: '0',
        addEmarId: '0',

        removeAdcIds: [],
        removeEmarIds: [],
      });
    });
  }

  getUnassignedIds() {
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

            wheres: [{ column: 'providerId', operator: 'IS', value: null }],

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

  render() {
    const adcIds = this.state.adcIds.map(adcId => {
      return (
        <li key={adcId} className="list-group-item list-group-item-action">
          <button
            className="btn btn-link stretched-link text-reset text-decoration-none p-0"
            type="button"
            data-id={adcId}
            data-id-type="Adc"
            onClick={this.handleClick}
          >
            {adcId}
            {this.state.removeAdcIds.includes(adcId) && (
              <React.Fragment>
                {' '}
                <SVGIcon
                  className="align-baseline"
                  type="trash"
                  width="1em"
                  height="1em"
                  fill="red"
                />
              </React.Fragment>
            )}
          </button>
        </li>
      );
    });

    const emarIds = this.state.emarIds.map(emarId => {
      return (
        <li key={emarId} className="list-group-item list-group-item-action">
          <button
            className="btn btn-link stretched-link text-reset text-decoration-none p-0"
            type="button"
            data-id={emarId}
            data-id-type="Emar"
            onClick={this.handleClick}
          >
            {emarId}{' '}
            {this.state.removeEmarIds.includes(emarId) && (
              <React.Fragment>
                {' '}
                <SVGIcon
                  className="align-baseline"
                  type="trash"
                  width="1em"
                  height="1em"
                  fill="red"
                />
              </React.Fragment>
            )}
          </button>
        </li>
      );
    });

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
          <form
            className="modal-content"
            onSubmit={this.handleSubmit}
            onReset={this.handleReset}
          >
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
                {this.state.lastName}, {this.state.firstName}{' '}
                {this.state.middleInitial}
              </p>
              <div className="form-row">
                <section className="col">
                  <h4>Name</h4>
                  <div className="form-row">
                    <div className="col-5">
                      <Input
                        type="text"
                        name="editLastName"
                        value={this.state.editLastName}
                        label="Last"
                        handleChange={this.handleChange}
                      />
                    </div>
                    <div className="col-5">
                      <Input
                        type="text"
                        name="editFirstName"
                        value={this.state.editFirstName}
                        label="First"
                        handleChange={this.handleChange}
                      />
                    </div>
                    <div className="col-2">
                      <Input
                        type="text"
                        name="editMiddleInitial"
                        value={this.state.editMiddleInitial}
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
                  {adcIds.length > 0 ? (
                    <ul className="list-group mb-1">{adcIds}</ul>
                  ) : (
                    <p className="font-italic">No assigned ADC IDs found!</p>
                  )}
                  {providerAdcs.length > 1 ? (
                    <Select
                      name="addAdcId"
                      value={this.state.addAdcId}
                      label="Add ADC ID"
                      options={providerAdcs}
                      handleChange={this.handleChange}
                    />
                  ) : (
                    <p className="font-italic">No unassigned ADC IDs found!</p>
                  )}
                </section>
                <section className="col">
                  <h4>EMAR IDs</h4>
                  {emarIds.length > 0 ? (
                    <ul className="list-group mb-1">{emarIds}</ul>
                  ) : (
                    <p className="font-italic">No assigned EMAR IDs found!</p>
                  )}
                  {providerEmars.length > 1 ? (
                    <Select
                      name="addEmarId"
                      value={this.state.addEmarId}
                      label="Add EMAR ID"
                      options={providerEmars}
                      handleChange={this.handleChange}
                    />
                  ) : (
                    <p className="font-italic">No unassigned EMAR IDs found!</p>
                  )}
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
