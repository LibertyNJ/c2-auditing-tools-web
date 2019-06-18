import { ipcRenderer } from 'electron';
import React from 'react';
import $ from 'jquery';

import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';

import '../../../node_modules/bootstrap/js/dist/modal';

export default class Modal extends React.Component {
  state = {
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
    isSubmitted: false,
  };

  componentDidMount = () => {
    this.initializeModal();
    ipcRenderer.once('modal', (event, data) => {
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
  };

  initializeModal = () => {
    $('#modal').modal({ show: false });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.providerId !== this.props.providerId) {
      this.getProviderData();
      this.getUnassignedIds();
    }

    if (!prevProps.isShown && this.props.isShown) {
      this.showModal();
    } else if (prevProps.isShown && !this.props.isShown) {
      this.hideModal();
    }
  }

  showModal = () => {
    $('#modal').modal('show');
  };

  hideModal = () => {
    $('#modal').modal('hide');
  };

  getProviderData = () => {
    ipcRenderer.send('database', {
      channel: 'modal',
      message: this.state,
    });
  };

  getUnassignedIds = () => {
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
            wheres: [
              {
                column: 'providerId',
                operator: 'IS',
                value: null,
              },
            ],
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
  };

  handleChange = event => {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  };

  handleClick = event => {
    const target = event.target;
    const name = `remove${target.dataset.idType}Ids`;
    const value = target.dataset.id;

    this.setState(state => {
      if (state[name].includes(value)) {
        return { [name]: [...state[name].filter(item => item !== value)] };
      }

      return { [name]: [...state[name], value] };
    });
  };

  handleReset = event => {
    event.preventDefault();

    this.setState({
      editLastName: this.state.lastName,
      editFirstName: this.state.firstName,
      editMiddleInitial: this.state.middleInitial,
      addAdcId: '0',
      addEmarId: '0',
      removeAdcIds: [],
      removeEmarIds: [],
    });
  };

  handleSubmit = event => {
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
      updateProviderAdcs();
    }

    updateProviderAdcs = () => {
      const data = {
        providerId: this.props.providerId,
        adcId: this.state.addAdcId,
      };
      ipcRenderer.send('updateProviderAdcs', data);
    };

    if (this.state.addEmarId > 0) {
      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },

        body: {
          table: 'providerEmar',
          parameters: {
            sets: [
              {
                column: 'providerId',
                value: this.props.providerId,
              },
            ],
            wheres: [
              {
                column: 'id',
                operator: '=',
                value: this.state.addEmarId,
              },
            ],
          },
        },
      });
    }

    if (this.state.removeAdcIds.length > 0) {
      const removeAdcIds = this.state.removeAdcIds.map(removeAdcId => ({
        column: 'name',
        operator: '=',
        value: removeAdcId,
      }));

      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },
        body: {
          table: 'providerAdc',
          parameters: {
            sets: [
              {
                column: 'providerId',
                value: null,
              },
            ],
            wheres: [removeAdcIds],
          },
        },
      });
    }

    if (this.state.removeEmarIds.length > 0) {
      const removeEmarIds = this.state.removeEmarIds.map(removeEmarId => ({
        column: 'name',
        operator: '=',
        value: removeEmarId,
      }));

      ipcRenderer.send('database', {
        header: {
          type: 'update',
        },
        body: {
          table: 'providerEmar',
          parameters: {
            sets: [
              {
                column: 'providerId',
                value: null,
              },
            ],
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

    this.setState({ isSubmitted: true });

    ipcRenderer.once('update', () => {
      this.getProviderData();
      this.getUnassignedIds();
      this.handleReset();
      this.setState({ isSubmitted: false });
    });
  };

  closeModal = () => {
    this.handleReset();
    this.props.formRef.current.handleSubmit();
    this.props.toggleModal();
  };

  render = () => (
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
          <ModalHeader closeModal={this.closeModal} />
          <ModalBody
            lastName={this.state.lastName}
            firstName={this.state.firstName}
            middleInitial={this.state.middleInitial}
            editLastName={this.state.editLastName}
            editFirstName={this.state.editFirstName}
            editMiddleInitial={this.state.editMiddleInitial}
            isSubmitted={this.state.isSubmitted}
            adcIds={this.state.adcIds}
            emarIds={this.state.emarIds}
            providerAdcs={this.state.providerAdcs}
            providerEmars={this.state.providerEmars}
          />
          <ModalFooter isSubmitted={this.state.isSubmitted} />
        </form>
      </div>
    </div>
  );
}
