import React from 'react';

import { ipcRenderer } from 'electron';

import NameSection from './NameSection';
import RemoveIdSection from './RemoveIdSection';
import AddIdSection from './AddIdSection';

export default class Form extends React.Component {
  state = {}

  componentDidMount = () => this.listenForDatabaseCommunication();

  listenForDatabaseCommunication = () => ipcRenderer.on('update-provider', (event, args) => { this.setState({}) });

  componentWillUnmount = () => this.stopListeningForDatabaseCommunication();

  stopListeningForDatabaseCommunication = () => ipcRenderer.removeAllListeners('update-provider');

  handleChange = ({ target }) => {
    if (Form.isSelectElement(target)) {
      const values = Form.getSelectedOptionValues(target);
      this.setState({ [target.name]: values });
    } else {
      this.setState({ [target.name]: target.value });
    }
  };

  handleReset = () => {

  };

  handleSubmit = () => this.sendUpdateToDatabase();

  sendUpdateToDatabase = () => {
    ipcRenderer.send('database', {
      channel: 'update-provider',
      message: '',
    });
  }

  render = () => (
    <form id="modal-form" onSubmit={this.handleSubmit} onReset={this.handleReset}>
      <NameSection handleChange={this.handleChange} />
      <RemoveIdSection
        handleChange={this.handleChange}
        adcIds={this.state.adcIds}
        emarIds={this.state.emarIds}
      />
      <AddIdSection handleChange={this.handleChange} />
    </form>
  );
}

// state = {
//   lastName: '',
//   firstName: '',
//   middleInitial: '',
//   adcIds: [],
//   emarIds: [],
//   editLastName: '',
//   editFirstName: '',
//   editMiddleInitial: '',
//   addAdcId: '0',
//   addEmarId: '0',
//   removeAdcIds: [],
//   removeEmarIds: [],
//   providerAdcs: [],
//   providerEmars: [],
//   isSubmitted: false,
// };

// const providerAdcs = props.providerAdcs.map(({ id, name }) => ({
//   value: id,
//   text: name,
// }));

// providerAdcs.unshift({
//   value: 0,
//   text: '',
// });

// const providerEmars = props.providerEmars.map(({ id, name }) => ({
//   value: id,
//   text: name,
// }));

// providerEmars.unshift({
//   value: 0,
//   text: '',
// });

// getProviderData = () => {
//   ipcRenderer.send('database', {
//     channel: 'modal',
//     message: this.state,
//   });

    // if (prevProps.providerId !== this.props.providerId) {
    //   this.getProviderData();
    //   this.getUnassignedIds();
    // }

    // ipcRenderer.once('modal', (event, data) => {
    //   const adcIds = data.body[0].adcIds ? data.body[0].adcIds.split('; ') : [];

    //   const emarIds = data.body[0].emarIds ? data.body[0].emarIds.split('; ') : [];

    //   this.setState({
    //     lastName: data.body[0].lastName,
    //     firstName: data.body[0].firstName,
    //     middleInitial: data.body[0].middleInitial,
    //     adcIds,
    //     emarIds,
    //     editLastName: data.body[0].lastName,
    //     editFirstName: data.body[0].firstName,
    //     editMiddleInitial: data.body[0].middleInitial,
    //     addAdcId: '0',
    //     addEmarId: '0',
    //     removeAdcIds: [],
    //     removeEmarIds: [],
    //   });
    // });

    // getUnassignedIds = () => {
    //   const tables = ['providerAdc', 'providerEmar'];
  
    //   tables.forEach((table) => {
    //     ipcRenderer.send('database', {
    //       header: {
    //         type: 'query',
    //         response: table,
    //       },
    //       body: {
    //         table,
    //         parameters: {
    //           columns: ['id', 'name'],
    //           wheres: [
    //             {
    //               column: 'providerId',
    //               operator: 'IS',
    //               value: null,
    //             },
    //           ],
    //           orderBys: [
    //             {
    //               column: 'name',
    //               direction: 'ASC',
    //             },
    //           ],
    //         },
    //       },
    //     });
  
    //     ipcRenderer.once(table, (event, data) => {
    //       this.setState({ [`${table}s`]: data.body });
    //     });
    //   });
    // };
  
    // handleChange = (event) => {
    //   const { target } = event;
    //   this.setState({ [target.name]: target.value });
    // };
  
    // handleClick = (event) => {
    //   const { target } = event;
    //   const name = `remove${target.dataset.idType}Ids`;
    //   const value = target.dataset.id;
  
    //   this.setState((state) => {
    //     if (state[name].includes(value)) {
    //       return { [name]: [...state[name].filter(item => item !== value)] };
    //     }
  
    //     return { [name]: [...state[name], value] };
    //   });
    // };
  
    // handleReset = (event) => {
    //   event.preventDefault();
  
    //   this.setState({
    //     editLastName: this.state.lastName,
    //     editFirstName: this.state.firstName,
    //     editMiddleInitial: this.state.middleInitial,
    //     addAdcId: '0',
    //     addEmarId: '0',
    //     removeAdcIds: [],
    //     removeEmarIds: [],
    //   });
    // };
  
    // handleSubmit = (event) => {
    //   event.preventDefault();
  
    //   const lastName = {
    //     column: 'lastName',
    //     value: this.state.editLastName,
    //   };
  
    //   const firstName = {
    //     column: 'firstName',
    //     value: this.state.editFirstName,
    //   };
  
    //   const middleInitial = {
    //     column: 'middleInitial',
    //     value: this.state.editMiddleInitial,
    //   };
  
    //   const id = this.props.providerId
    //     ? {
    //       column: 'id',
    //       operator: '=',
    //       value: this.props.providerId,
    //     }
    //     : null;
  
    //   if (this.state.addAdcId > 0) {
    //     updateProviderAdcs();
    //   }
  
    //   updateProviderAdcs = () => {
    //     const data = {
    //       providerId: this.props.providerId,
    //       adcId: this.state.addAdcId,
    //     };
    //     ipcRenderer.send('updateProviderAdcs', data);
    //   };
  
    //   if (this.state.addEmarId > 0) {
    //     ipcRenderer.send('database', {
    //       header: {
    //         type: 'update',
    //       },
  
    //       body: {
    //         table: 'providerEmar',
    //         parameters: {
    //           sets: [
    //             {
    //               column: 'providerId',
    //               value: this.props.providerId,
    //             },
    //           ],
    //           wheres: [
    //             {
    //               column: 'id',
    //               operator: '=',
    //               value: this.state.addEmarId,
    //             },
    //           ],
    //         },
    //       },
    //     });
    //   }
  
    //   if (this.state.removeAdcIds.length > 0) {
    //     const removeAdcIds = this.state.removeAdcIds.map(removeAdcId => ({
    //       column: 'name',
    //       operator: '=',
    //       value: removeAdcId,
    //     }));
  
    //     ipcRenderer.send('database', {
    //       header: {
    //         type: 'update',
    //       },
    //       body: {
    //         table: 'providerAdc',
    //         parameters: {
    //           sets: [
    //             {
    //               column: 'providerId',
    //               value: null,
    //             },
    //           ],
    //           wheres: [removeAdcIds],
    //         },
    //       },
    //     });
    //   }
  
    //   if (this.state.removeEmarIds.length > 0) {
    //     const removeEmarIds = this.state.removeEmarIds.map(removeEmarId => ({
    //       column: 'name',
    //       operator: '=',
    //       value: removeEmarId,
    //     }));
  
    //     ipcRenderer.send('database', {
    //       header: {
    //         type: 'update',
    //       },
    //       body: {
    //         table: 'providerEmar',
    //         parameters: {
    //           sets: [
    //             {
    //               column: 'providerId',
    //               value: null,
    //             },
    //           ],
    //           wheres: [removeEmarIds],
    //         },
    //       },
    //     });
    //   }
  
    //   ipcRenderer.send('database', {
    //     header: {
    //       type: 'update',
    //       response: 'update',
    //     },
    //     body: {
    //       table: 'provider',
    //       parameters: {
    //         sets: [lastName, firstName, middleInitial],
    //         wheres: [id],
    //       },
    //     },
    //   });
  
    //   this.setState({ isSubmitted: true });
  
    //   ipcRenderer.once('update', () => {
    //     this.getProviderData();
    //     this.getUnassignedIds();
    //     this.handleReset();
    //     this.setState({ isSubmitted: false });
    //   });
    // };
