import React from 'react';

import { ipcRenderer } from 'electron';

import Select from '../../../../../components/FormControl/Select';

export default class AddIdSection extends React.Component {
  static propTypes = {

  };

  state = {
    providerAdcNames: [],
    providerEmarNames: [],
  };

  componentDidMount = () => this.listenForDatabaseCommunication();

  listenForDatabaseCommunication = () => {
    ipcRenderer.on('readAdcIds', (event, args) => {});
    ipcRenderer.on('readEmarIds', (event, args) => {});
  };

  componentWillUnmount = () => this.stopListeningForDatabaseCommunication();

  stopListeningForDatabaseCommunication = () => {
    ipcRenderer.removeAllListeners('readAdcIds');
    ipcRenderer.removeAllListeners('readEmarIds');
  }

  render = () => (
    <section>
      <h4 className="text-primary">Add ID</h4>
      <section>
        <h5>ADC ID</h5>
        <Select
          name="addAdcId"
          value={this.props.addAdcId}
          isDisabled={this.props.isSubmitted}
          label="Add ADC ID"
          options={this.state.providerAdcNames}
          attributes={{ multiple: true }}
          handleChange={this.props.handleChange}
        />
        <div className="alert alert-info">
          No unassigned ADC IDs found!
        </div>
      </section>
      <section>
        <h5>EMAR ID</h5>
        <Select
          name="addEmarId"
          value={this.props.addEmarId}
          isDisabled={this.props.isSubmitted}
          label="Add EMAR ID"
          options={this.state.providerEmarNames}
          attributes={{ multiple: true }}
          handleChange={this.props.handleChange}
        />
        <div className="alert alert-info">
          No unassigned EMAR IDs found!
        </div>
      </section>
    </section>
  );
}
