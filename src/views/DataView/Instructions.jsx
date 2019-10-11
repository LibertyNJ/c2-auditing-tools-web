import React from 'react';

export default function Instructions() {
  return (
    <React.Fragment>
      <p className="lead">Import data to the database.</p>
      <p>Use the filepickers below to add data to the database.</p>
      <ol>
        <li>
          Download these reports from BICC and RxAuditor for the same time period:
          <ul>
            <li>
              Medication Order Task Status Detail (<span className="font-italic">as CSV</span>)
            </li>
            <li>
              C2 Activity (<span className="font-italic">as XLSX</span>)
            </li>
          </ul>
        </li>
        <li>Browse to each file using the filepickers below.</li>
        <li>Press the import button.</li>
      </ol>
    </React.Fragment>
  );
}
