// import Excel from 'exceljs';
// import fs from 'fs';
import { ipcRenderer } from 'electron';
import React from 'react';
// import database from '../database';

const Data = () => (
  <React.Fragment>
    <h1 className="text-center">Data</h1>
    <div className="row">
      <div className="col mx-auto" style={{ maxWidth: '33em' }}>
        <p className="lead">Upload data to the database.</p>
        <p>Use the filepickers below to add data to the database.</p>
        <ol>
          <li>
            Download these reports from BICC and RxAuditor for the same time period:
            <ul>
              <li>
                Medication Order Task Status Summary (<span className="font-italic">as CSV</span>)
              </li>
              <li>
                C2 Activity (<span className="font-italic">as XLSX</span>)
              </li>
            </ul>
          </li>
          <li>Select each file with the appropriate filepicker widget.</li>
          <li>Press upload.</li>
        </ol>
        <DataUploadForm />
      </div>
    </div>
  </React.Fragment>
);

class DataUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emar: '',
      adc: '',
      isUploading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const fileNameName = `${name}FileName`;
    const fileNameValue = target.files[0].name;
    const filePathName = `${name}FilePath`;
    const filePathValue = target.files[0].path;

    this.setState({
      [name]: value,
      [fileNameName]: fileNameValue,
      [filePathName]: filePathValue,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isUploading: true });
    ipcRenderer.send('data-upload', { emarPath: this.state.emar, adcPath: this.state.adc });
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-row">
          <div className="col">
            <FileInput
              name="emar"
              value={this.state.emar}
              label="Medication Order Task Status:"
              fileName={this.state.FileName}
              handleChange={this.emarhandleChange}
              disabled={this.state.isUploading}
              attributes={{
                accept: '.csv',
                required: true,
              }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col">
            <FileInput
              name="adc"
              value={this.state.adc}
              label="C2 Activity:"
              fileName={this.state.adcFileName}
              handleChange={this.handleChange}
              disabled={this.state.isUploading}
              attributes={{
                accept: '.xlsx',
                required: true,
              }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col">
            <UploadButton isUploading={this.state.isUploading} />
          </div>
        </div>
      </form>
    );
  }
}

const FileInput = props => (
  <div className="custom-file mb-3">
    <input
      id={props.name}
      className="custom-file-input"
      type="file"
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      onChange={props.handleChange}
      {...props.attributes}
    />
    <label className="custom-file-label" htmlFor={props.name}>
      {props.label} {props.fileName}
    </label>
  </div>
);

const UploadButton = (props) => {
  if (props.isUploading) {
    return (
      <button className="btn btn-primary mb-3 ml-auto" type="submit" disabled>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        Uploading…
      </button>
    );
  }

  return (
    <button className="btn btn-primary d-block mb-3 ml-auto" type="submit">
      Upload
    </button>
  );
};

export default Data;
