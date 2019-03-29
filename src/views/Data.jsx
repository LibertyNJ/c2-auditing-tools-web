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
          return 'Oxycodone–Acetaminophen';
        }

        return 'Oxycodone';
      }

      if (/hydromorphone/i.test(string)) {
        return 'Hydromorphone';
      }

      if (/morphine/i.test(string)) {
        return 'Morphine';
      }

      if (/fentanyl/i.test(string)) {
        return 'Fentanyl';
      }

      if (/hydrocodone/i.test(string)) {
        if (/homatrop/i.test(string)) {
          return 'Hydrocodone–Homatropine';
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
        if (/[^a-zA-Z]ER[^a-zA-Z]/.test(string)) {
          return 'ER Tablet';
        }

        return 'Tablet';
      }

      if (/[^a-zA-Z]ir[^a-zA-Z]|oxycodone.*acetaminophen/i.test(string)) {
        return 'Tablet';
      }

      if (/capsule/i.test(string)) {
        return 'Capsule';
      }

      if (/cup|syrup|solution|liquid/i.test(string)) {
        return 'Cup';
      }

      if (/vial/i.test(string)) {
        return 'Vial';
      }

      if (/injectable/i.test(string)) {
        return 'Injectable';
      }

      if (/ampule/i.test(string)) {
        return 'Ampule';
      }

      if (/patch/i.test(string)) {
        return 'Patch';
      }

      if (/bag|infusion|ivbp/i.test(string)) {
        return 'Bag';
      }

      if (/syringe|tubex|pca/i.test(string)) {
        return 'Syringe';
      }

      if (/concentrate/i.test(string)) {
        return 'Concentrate';
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

    database.open();

    const adcData = fs.createReadStream(`file://${this.state.adcFilePath}`);

    const adcWorkbook = new Excel.Workbook();
    adcWorkbook.xlsx
      .read(adcData)
      .then(() => {
        const getTimestamp = (date, time) => {
          const [month, day, year] = date.split(/\//);
          return `'${year}/${month}/${day}T${time}'`;
        };

        const worksheet = adcWorkbook.getWorksheet(1);
        worksheet.eachRow((row, rowNumber) => {
          const headerRowNumber = 11;
          const transactionType = getTransactionType(row.getCell('E').value);

          if (rowNumber > headerRowNumber && transactionType) {
            const strength = row.getCell('O').value;
            const units = getUnits(row.getCell('P').value);
            const form = getForm(row.getCell('C').value);
            const medicationOrderId = row.getCell('J').value.slice(1);
            const amount = row.getCell('D').value;
            const timestamp = getTimestamp(
              row.getCell('A').value,
              row.getCell('B').value
            );

            database.serialize(() => {
              database.create('providerAdc', {
                onConflict: 'ignore',
                data: { name: row.getCell('K').value },
              });

              const providerAdcId = database.read('providerAdc', {
                columns: ['id'],
                where: { name: row.getCell('K').value },
              });

              database.create('medicationProductAdc', {
                onConflict: 'ignore',
                data: { name: row.getCell('C').value },
              });

              const medicationProductAdcId = database.read(
                'medicationProductAdc',
                {
                  columns: ['id'],
                  where: { name: row.getCell.toString('C').value },
                }
              );

              const medicationId = database.read('medication', {
                columns: ['id'],
                where: { name: getMedication(row.getCell('C').value) },
              });

              database.create('medicationProduct', {
                onConflict: 'ignore',
                data: {
                  medicationId,
                  strength,
                  units,
                  form,
                  adcId: medicationProductAdcId,
                },
              });

              const medicationProductId = database.read('medicationProduct', {
                columns: ['id'],
                where: { adcId: medicationProductAdcId },
              });

              database.create(transactionType, {
                onConflict: 'ignore',
                data: {
                  providerAdcId,
                  medicationOrderId,
                  medicationProductId,
                  amount,
                  timestamp,
                },
              });

              if (/WASTED/.test(row.getCell('F').value)) {
                const waste = row.getCell('F').value.split(/\s/)[2];

                database.create('waste', {
                  onConflict: 'ignore',
                  data: {
                    providerAdcId,
                    medicationOrderId,
                    medicationProductId,
                    waste,
                    timestamp,
                  },
                });
              }
            });
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
        const getTimestamp = string => {
          if (!string) {
            return null;
          }

          const [date, time, meridian] = string.split(/\s/);

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
            const visitId = row.getCell('F').value;
            const discharged = getTimestamp(row.getCell('L').value);
            const mrn = row.getCell('G').value.padStart(8, '0');
            const medicationOrderId = row.getCell('M').value;
            let [dose, units] = row.getCell('R').value.split(/\s/);
            const form = getForm(row.getCell('P').value);
            units = getUnits(units);
            const timestamp = getTimestamp(row.getCell('AM'));

            database.create('visit', {
              onConflict: 'ignore',
              data: {
                id: visitId,
                discharged,
                mrn,
              },
            });

            database.serialize(() => {
              const medicationId = database.read('medication', {
                columns: ['id'],
                where: { name: getMedication(row.getCell('O').value) },
              });

              database.create('medicationOrder', {
                onConflict: 'ignore',
                data: {
                  id: medicationOrderId,
                  medicationId,
                  dose,
                  units,
                  form,
                  visitId,
                },
              });

              database.create('providerEmar', {
                onConflict: 'ignore',
                data: {
                  name: row.getCell('AP').value,
                },
              });

              const providerEmarId = database.read('providerEmar', {
                columns: ['id'],
                where: { name: row.getCell('AP').value },
              });

              database.create('administration', {
                onConflict: 'ignore',
                data: { providerEmarId, medicationOrderId, timestamp },
              });
            });
          }
        });
      })
      .then(() => emarData.close())
      .catch(error => console.error(error));
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
