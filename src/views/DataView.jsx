import React from 'react';

import Column from '../components/Column';
import FormRow from '../components/FormRow';
import Italic from '../components/Italic';
import FormFileInput from '../redux/containers/FormFileInput';
import FormIconButton from '../redux/containers/FormIconButton';
import ImportDataForm from '../redux/containers/ImportDataForm';

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
          <FormRow>
            <Column>
              <FormFileInput
                accept=".csv"
                form="importData"
                label="MOTS Detail Report"
                name="medicationOrderTaskStatusDetailReport"
                required
                wrapperClassName="mb-3"
              />
            </Column>
          </FormRow>
          <FormRow>
            <Column>
              <FormFileInput
                accept=".xlsx"
                form="importData"
                label="C2 Activity Report"
                name="c2ActivityReport"
                required
                wrapperClassName="mb-3"
              />
            </Column>
          </FormRow>
          <FormRow>
            <Column>
              <FormIconButton className="btn-primary mb-3 ml-auto text-nowrap" icon="file-import">
                Search
              </FormIconButton>
            </Column>
          </FormRow>
        </ImportDataForm>
      </section>
    </React.Fragment>
  );
}
