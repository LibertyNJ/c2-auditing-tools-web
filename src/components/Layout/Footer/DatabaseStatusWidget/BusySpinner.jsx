import React from 'react';
import PropTypes from 'prop-types';

BusySpinner.propTypes = {
  screenReaderText: PropTypes.string.isRequired,
};

export default function BusySpinner({ screenReaderText }) {
  return (
    <div
      className="spinner-grow text-warning align-baseline"
      role="status"
      style={{ width: '1em', height: '1em' }}
    >
      <span className="sr-only">{screenReaderText}</span>
    </div>
  );
}
