import React from 'react';

import Form from './Form';
import Italics from '../../components/Italics';

export default function DataView() {
  return (
    <React.Fragment>
      <section className="mx-auto" style={{ maxWidth: '33em' }}>
        <ol>
          <li>
            Download reports BICC and RxAuditor for the same time period:
            <ul>
              <li>
                Medication Order Task Status Detail (<Italics>as CSV</Italics>)
              </li>
              <li>
                C2 Activity (<Italics>as XLSX</Italics>)
              </li>
            </ul>
          </li>
          <li>Select each file below.</li>
          <li>Press the import button.</li>
        </ol>
        <Form />
      </section>
    </React.Fragment>
  );
}
