import path from 'path';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from '../components/SVGIcon';

const DataView = () => (
  <React.Fragment>
    <h1 className="text-center">Data</h1>
    <div className="row">
      <div className="col mx-auto" style={{ maxWidth: '33em' }}>
        <p className="lead">Import data to the database.</p>
        <p>Use the filepickers below to add data to the database.</p>
        <ol>
          <li>
            Download these reports from BICC and RxAuditor for the same time
            period:
            <ul>
              <li>
                Medication Order Task Status Summary (
                <span className="font-italic">as CSV</span>)
              </li>
              <li>
                C2 Activity (<span className="font-italic">as XLSX</span>){' '}
              </li>
            </ul>
          </li>
          <li>Select each file with the appropriate filepicker widget.</li>
          <li>Press import.</li>
        </ol>
        <DataImportForm />
      </div>
    </div>
  </React.Fragment>
);

class DataImportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emar: '',
      emarPath: '',
      adc: '',
      adcPath: '',
      isImporting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });

    if (value) {
      const pathName = `${name}Path`;
      const pathValue = target.files[0].path;

      this.setState({ [pathName]: pathValue });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ isImporting: true });

    ipcRenderer.send('database', {
      header: 'import',
      body: {
        adcPath: this.state.adcPath,
        emarPath: this.state.emarPath,
      },
    });

    ipcRenderer.once('database', (event, message) => {
      if (message === 'Data import complete.') {
        this.setState({ isImporting: false });
      }
    });
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-row">
          <div className="col">
            <FileInput
              name="emar"
              value={this.state.emar}
              label={
                <React.Fragment>
                  <SVGIcon
                    className="align-baseline"
                    type="file-csv"
                    width="1em"
                    height="1em"
                    fill="#212529"
                  />{' '}
                  Medication Order Task Status:{' '}
                </React.Fragment>
              }
              handleChange={this.handleChange}
              disabled={this.state.isImporting}
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
              label={
                <React.Fragment>
                  <SVGIcon
                    className="align-baseline"
                    type="file-excel"
                    width="1em"
                    height="1em"
                    fill="#212529"
                  />{' '}
                  C2 Activity:{' '}
                </React.Fragment>
              }
              handleChange={this.handleChange}
              disabled={this.state.isImporting}
              attributes={{
                accept: '.xlsx',
                required: true,
              }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col">
            <ImportButton isImporting={this.state.isImporting} />
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
      {props.label} {path.basename(props.value)}
    </label>
  </div>
);

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  attributes: PropTypes.object,
  label: PropTypes.node.isRequired,
};

FileInput.defaultProps = {
  attributes: null,
};

const ImportButton = props => {
  if (props.isImporting) {
    return (
      <button
        className="btn btn-primary d-block mb-3 ml-auto"
        type="submit"
        disabled
      >
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
        Importing…
      </button>
    );
  }

  return (
    <button className="btn btn-primary d-block mb-3 ml-auto" type="submit">
      <SVGIcon
        className="align-baseline"
        type="file-import"
        width="1em"
        height="1em"
        fill="white"
      />{' '}
      Import
    </button>
  );
};

ImportButton.propTypes = {
  isImporting: PropTypes.bool.isRequired,
};

export default DataView;
