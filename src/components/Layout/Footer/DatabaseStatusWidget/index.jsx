import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../../../SVGIcon';

import DatabaseBusySpinner from './DatabaseBusySpinner';

DatabaseStatusWidget.propTypes = {
  databaseStatus: PropTypes.string.isRequired,
};

export default function DatabaseStatusWidget({ databaseStatus }) {
  const databaseStatusTextColorClass = getDatabaseStatusTextColorClass(databaseStatus);

  return (
    <div className="mb-0">
      <SVGIcon className="align-baseline" type="database" width="1em" height="1em" fill="white" />{' '}
      Database:{' '}
      {databaseStatusTextColorClass === 'text-warning' && (
        <DatabaseBusySpinner databaseStatus={databaseStatus} />
      )}
      <span className={databaseStatusTextColorClass}>{databaseStatus}</span>
    </div>
  );
}

export function getDatabaseStatusTextColorClass(databaseStatus) {
  switch (databaseStatus) {
    case 'Ready':
      return 'text-success';
    case 'Error':
    case 'Unknown':
      return 'text-danger';
    default:
      return 'text-warning';
  }
}
