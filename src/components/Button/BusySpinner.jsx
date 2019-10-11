import React from 'react';

export default function ButtonBusySpinner() {
  return (
    <div
      className="spinner-border text-white align-baseline"
      role="status"
      style={{ height: '1em', width: '1em' }}
    >
      <span className="sr-only">Button is busy.</span>
    </div>
  );
}
