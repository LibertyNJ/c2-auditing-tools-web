import Excel from 'exceljs';
import fs from 'fs';
import React from 'react';
import database from '../database';

const Data = () => (
  <main className="container-fluid overflow-auto">
    <h1 className="text-center">Data</h1>
    <p className="lead">Upload data to the database.</p>
    <p>Use the filepickers below to add data to the database.</p>
    <ol>
      <li>
        Download these reports from BICC and RxAuditor for the same time period:
        <ul>
          <li>Medication Order Task Status Summary (as CSV)</li>
          <li>C2 Activity (as XLSX)</li>
        </ul>
      </li>
      <li>Select each file with the appropriate filepicker widget.</li>
      <li>Press upload.</li>
    </ol>
    <DataUploadForm />
  </main>
);

class DataUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emar: '',
      emarFileName: '',
      emarFilePath: '',
      adc: '',
      adcFileName: '',
      adcFilePath: '',
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

    const getMedication = string => {
      if (/oxycodone/i.test(string)) {
        if (/acetaminophen/i.test(string)) {
          return 'acetaminophen-oxycodone';
        }

        return 'oxycodone';
      }

      if (/hydromorphone/i.test(string)) {
        return 'hydromorphone';
      }

      if (/morphine/i.test(string)) {
        return 'morphine';
      }

      if (/fentanyl/i.test(string)) {
        return 'fentanyl';
      }

      if (/hydrocodone/i.test(string)) {
        if (/homatrop/i.test(string)) {
          return 'homatropine-hydrocodone';
        }

        return null;
      }

      return null;
    };

    const getUnits = string => {
      if (/milligram/i.test(string)) {
        return 'mG';
      }

      if (/microgram/i.test(string)) {
        if (/kg\/hr/i.test(string)) {
          return 'mCg/kG/Hr';
        }

        return 'mCg';
      }

      if (/mg\/hr/i.test(string)) {
        return 'mG/Hr';
      }

      if (/tablet/i.test(string)) {
        return 'tablet';
      }

      if (/patch/i.test(string)) {
        return 'patch';
      }

      return null;
    };

    const getForm = string => {
      if (/tablet/i.test(string)) {
        return 'tablet';
      }

      if (/capsule/i.test(string)) {
        return 'capsule';
      }

      if (/cup/i.test(string)) {
        return 'cup';
      }

      if (/vial/i.test(string)) {
        return 'vial';
      }

      if (/ampule/i.test(string)) {
        return 'ampule';
      }

      if (/patch/i.test(string)) {
        return 'patch';
      }

      if (/bag/i.test(string)) {
        return 'bag';
      }

      if (/syringe|tubex/i.test(string)) {
        return 'syringe';
      }

      if (/concentrate/i.test(string)) {
        return 'concentrate';
      }

      return null;
    };

    const getTransactionType = string => {
      switch (string) {
        case 'WITHDRAWN':
          return 'withdrawal';

        case 'RESTOCKED':
          return 'restock';

        case 'RETURNED':
          return 'return';

        default:
          return null;
      }
    };

    const getTimestamp = (date, time) => {
      const [month, day, year] = date.split(/\//);
      return `'${year}/${month}/${day}T${time}'`;
    };

    database.open();

    const adcData = fs.createReadStream(`file://${this.state.adcFilePath}`);

    const adcWorkbook = new Excel.Workbook();
    adcWorkbook.xlsx
      .read(adcData)
      .then(() => {
        const worksheet = adcWorkbook.getWorksheet(1);
        worksheet.eachRow((row, rowNumber) => {
          const headerRowNumber = 11;

          if (rowNumber > headerRowNumber) {
            database.create('medicationProductAdcId', {
              onConflict: 'ignore',
              data: { value: row.getCell.toString('C').value },
            });

            const medication = getMedication(row.getCell.toString('C').value);
            const strength = row.getCell('O').value;
            const units = getUnits(row.getCell('P').value);
            const form = getForm(row.getCell.toString('C').value);
            const adcId = database.read(
              'medicationProductAdcId',
              {
                columns: ['id'],
                where: { value: row.getCell.toString('C').value },
              }
            );

            database.create('medicationProduct', {
              onConflict: 'ignore',
              data: {
                medication,
                strength,
                units,
                form,
                adcId,
              },
            });

            const transactionType = getTransactionType(row.getCell('E').value);

            if (transactionType) {
              database.create('providerAdcId', {
                onConflict: 'ignore',
                data: { value: row.getCell('K').value },
              });

              const providerId = database.read('provider', {
                columns: ['id'],
                where: { adcId: `= ${row.getCell('K').value}` },
              });

              const medicationOrderId = row.getCell('J').value.slice(1);

              const medicationProductId = database.read('medicationProduct', {
                columns: ['id'],
                where: { adcId: medicationProductAdcId },
              });

              const amount = row.getCell('D').value;

              const timestamp = getTimestamp(
                row.getCell('A').value,
                row.getCell('B').value
              );

              database.create(transactionType, {
                onConflict: 'ignore',
                data: {
                  providerId,
                  medicationOrderId,
                  medicationProductId,
                  amount,
                  timestamp,
                },
              });
            }

            if (/WASTED/.test(row.getCell('F').value)) {
              database.create('providerAdcId', {
                onConflict: 'ignore',
                data: { value: row.getCell('K').value },
              });

              const providerId = database.read('provider', {
                columns: ['id'],
                where: { adcId: `= ${row.getCell('K').value}` },
              });

              const medicationOrderId = row.getCell('J').value.slice(1);

              const medicationProductId = database.read('medicationProduct', {
                columns: ['id'],
                where: { adcId: medicationProductAdcId },
              });

              const waste = row.getCell('F').value.split(/\s/)[2];

              const timestamp = getTimestamp(
                row.getCell('A').value,
                row.getCell('B').value
              );

              database.create('waste', {
                onConflict: 'ignore',
                data: {
                  providerId,
                  medicationOrderId,
                  medicationProductId,
                  waste,
                  timestamp,
                },
              });
            }
          }
        });
      })
      .then(() => adcData.close())
      .catch(error => {
        throw error;
      });

    const emarData = fs.createReadStream(`file://${this.state.emarFilePath}`);

    const emarWorkbook = new Excel.Workbook();
    emarWorkbook.csv
      .read(emarData)
      .then(worksheet => {
        const formatEmarDatetime = value => {
          if (!value) {
            return null;
          }

          const [date, time, meridian] = value.split(/\s/);

          let [month, day, year] = date.split(/\//);
          month = month.padStart(2, '0');
          day = day.padStart(2, '0');

          let [hours, minutes] = time.split(/:/);
          if (meridian === 'PM' && hours !== '12') {
            hours = (+hours + 12).toString();
          } else if (meridian === 'AM' && hours === '12') {
            hours = '00';
          } else {
            hours = hours.padStart(2, '0');
          }
          return `${year}/${month}/${day}T${hours}:${minutes}:00`;
        };

        worksheet.eachRow((row, rowNumber) => {
          const headerRowNumber = 7;
          if (rowNumber > headerRowNumber) {
            const generic = row.getCell('O').value;
            const product = row.getCell('P').value;
            const providerEmarId = row.getCell('AP').value;

            database.create('providerEmarId', {
              onConflict: 'ignore',
              data: {
                value: providerEmarId,
              },
            });

            const providerId = database.read('provider', 'id', {
              emarId: `= '${row.getCell('AP').value}'`,
            });

            const medicationOrderId = row.getCell('M').value;

            const timestamp = formatEmarDatetime(row.getCell('AM'));

            database.create('administration', {
              onConflict: 'ignore',
              data: { providerId, medicationOrderId, timestamp },
            });

            const visitId = row.getCell('F').value;
            const discharged = formatEmarDatetime(row.getCell('L').value);
            const mrn = row.getCell('G').value.padStart(8, '0');

            database.create('visit', {
              onConflict: 'ignore',
              data: {
                id: visitId,
                discharged,
                mrn,
              },
            });

            const medication = row.getCell('O').value;
            let [dose, units] = row.getCell('R').value.split(/\s/);
            units = getEmarUnits(units);
            const form = row.getCell('P').value;

            database.create('medicationOrder', {
              onConflict: 'ignore',
              data: {
                id: medicationOrderId,
                medication,
                dose,
                units,
                form,
                visitId,
              },
            });
          }
        });
      })
      .then(() => emarData.close())
      .catch(error => console.error(error));

    database.close();
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-row">
          <div className="col-6">
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
          <div className="col-6">
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
          <div className="col-6">
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

const UploadButton = props => {
  if (props.isUploading) {
    return (
      <button className="btn btn-primary mb-3 ml-auto" type="submit" disabled>
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
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
