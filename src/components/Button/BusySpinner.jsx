import React from 'react';

export default function ButtonBusySpinner({ ...restProps }) {
  return (
    <div
      className="align-baseline spinner-border text-white"
      role="status"
      style={{ height: '1em', width: '1em' }}
      {...restProps}
    >
      <span className="sr-only">Button is busy.</span>
    </div>
  );
}
