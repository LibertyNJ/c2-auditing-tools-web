import React from 'react';
import PropTypes from 'prop-types';

DatabaseBusySpinner.propTypes = {
  databaseStatus: PropTypes.string.isRequired,
};

export default function DatabaseBusySpinner({ databaseStatus }) {
  return (
    <React.Fragment>
      <div
        className="spinner-grow text-warning align-baseline"
        role="status"
        style={{ width: '1em', height: '1em' }}
      >
        <span className="sr-only">{databaseStatus}</span>
      </div>{' '}
    </React.Fragment>
  );
}
