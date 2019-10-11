import React from 'react';

import { ipcRenderer } from 'electron';

import FormRow from '../../../components/FormRow';
import FileInput from './FileInput';
import Button from '../../../components/Button';

export default class Form extends React.Component {
  CHANNEL = 'import-data';

  state = { isSubmitted: false };

  componentWillUnmount = () => {
    this.stopListeningForDatabaseCommunication();
  };

  stopListeningForDatabaseCommunication = () => {
    ipcRenderer.removeAllListeners(this.CHANNEL);
  };

  handleChange = ({ target }) => {
    this.setFileNameAndPath(target);
  };

  setFileNameAndPath = (target) => {
    const { name, value } = target;
    const pathName = `${name}Path`;
    const pathValue = target.files[0].path;
    this.setState({
      [name]: value,
      [pathName]: pathValue,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendFilePathsToBackend();
    this.toggleIsSubmitted();
    this.listenForBackendResponse();
  };

  sendFilePathsToBackend = () => {
    const { c2ActivityReportPath, medicationOrderTaskStatusDetailReportPath } = this.state;
    ipcRenderer.send('backend', {
      body: {
        c2ActivityReportPath,
        medicationOrderTaskStatusDetailReportPath,
      },
      channel: this.CHANNEL,
    });
  };

  toggleIsSubmitted = () => {
    this.setState(state => ({ isSubmitted: !state.isSubmitted }));
  };

  listenForBackendResponse = () => {
    ipcRenderer.once(this.CHANNEL, () => this.toggleIsSubmitted());
  };

  render = () => (
    <form onSubmit={this.handleSubmit}>
      <FormRow>
        <FileInput
          accept=".csv"
          handleChange={this.handleChange}
          disabled={this.state.isSubmitted}
          label="Medication Order Task Status Detail Report"
          name="medicationOrderTaskStatusDetailReport"
          required
          value={this.state.medicationOrderTaskStatusDetailReport}
          wrapperClassName="col mb-3"
        />
      </FormRow>
      <FormRow>
        <FileInput
          accept=".xlsx"
          handleChange={this.handleChange}
          disabled={this.state.isSubmitted}
          label="C2 Activity Report"
          name="c2ActivityReport"
          required
          value={this.state.c2ActivityReport}
          wrapperClassName="col mb-3"
        />
      </FormRow>
      <FormRow>
        <Button
          className="btn-primary d-block mb-3 ml-auto"
          disabled={this.state.isSubmitted}
          iconType="file-import"
          type="submit"
        >
          Import
        </Button>
      </FormRow>
    </form>
  );
}
