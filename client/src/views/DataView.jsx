import React from 'react';

import ImportDataForm from '../components/ImportDataForm';
import Italic from '../components/Italic';
import FormFileInput from '../redux/containers/FormFileInput';

export default function DataView() {
  return (
    <React.Fragment>
      <section className="m-auto" style={{ maxWidth: '33em' }}>
        <ol>
          <li>
            Download these reports for the same time period:
            <ul>
              <li>
                Medication Order Task Status Detail <Italic>(as CSV)</Italic>
              </li>
              <li>
                C2 Activity <Italic>(as XLSX)</Italic>
              </li>
            </ul>
          </li>
          <li>Select each file below.</li>
          <li>Press the import button.</li>
        </ol>
        <ImportDataForm id="importData">
          <FormFileInput
            accept=".csv"
            label="MOTS Detail Report"
            name="medicationOrderTaskStatusDetailReport"
            required
            wrapperClassName="mb-3"
          />
          <FormFileInput
            accept=".xlsx"
            label="C2 Activity Report"
            name="c2ActivityReport"
            required
            wrapperClassName="mb-3"
          />
        </ImportDataForm>
      </section>
    </React.Fragment>
  );
}
