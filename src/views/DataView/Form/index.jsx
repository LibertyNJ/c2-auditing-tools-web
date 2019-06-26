import React from 'react';

import { ipcRenderer } from 'electron';

import FormRow from '../../../components/FormRow';
import FileInput from './FileInput';
import Button from '../../../components/Button';

export default class Form extends React.Component {
  static CHANNEL = 'import';

  state = { isSubmitted: false };

  componentWillUnmount = () => this.stopListeningForDatabaseCommunication();

  stopListeningForDatabaseCommunication = () => ipcRenderer.removeAllListeners('import');

  handleChange = ({ target }) => this.setFileNameAndPath(target);

  setFileNameAndPath = (target) => {
    const { name, value } = target;
    const pathName = `${name}Path`;
    const pathValue = target.files[0].path;

    this.setState({
      [name]: value,
      [pathName]: pathValue,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendFilePathsToDatabase();
    this.toggleIsSubmitted();
    this.listenForDatabaseReponse();
  }

  sendFilePathsToDatabase = () => {
    ipcRenderer.send('database', {
      channel: Form.CHANNEL,
      message: {
        c2ActivityReportPath: this.state.c2ActivityReportPath,
        medicationOrderTaskStatusDetailReportPath: this.state.medicationOrderTaskStatusDetailReportPath,
      },
    });
  }

  toggleIsSubmitted = () => this.setState((state) => {
    return { isSubmitted: !state.isSubmitted };
  });

  listenForDatabaseReponse = () => ipcRenderer.once(Form.CHANNEL, () => this.toggleIsSubmitted());

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <FormRow>
          <FileInput
            name="medicationOrderTaskStatusDetailReport"
            value={this.state.medicationOrderTaskStatusDetailReport}
            label="Medication Order Task Status Detail Report"
            isDisabled={this.state.isSubmitted}
            handleChange={this.handleChange}
            attributes={{
              accept: '.csv',
              required: true,
            }}
          />
        </FormRow>
        <FormRow>
          <FileInput
            name="c2ActivityReport"
            value={this.state.c2ActivityReport}
            label="C2 Activity Report"
            isDisabled={this.state.isSubmitted}
            handleChange={this.handleChange}
            attributes={{
              accept: '.xlsx',
              required: true,
            }}
          />
        </FormRow>
        <Button
          type="submit"
          text="Import"
          iconType="file-import"
          color="primary"
          disabled={this.state.isSubmitted}
          className="d-block mb-3 ml-auto"
        />
      </form>
    );
  }
}
