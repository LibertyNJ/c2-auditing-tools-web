import React from 'react';

export default function ButtonBusySpinner() {
  return (
    <React.Fragment>
      <div
        className="spinner-border text-white align-baseline"
        role="status"
        style={{ width: '1em', height: '1em' }}
      >
        <span className="sr-only">Button is busy.</span>
      </div>{' '}
    </React.Fragment>
  );
}
