import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BusySpinner from './BusySpinner';
import { getTextClassName, isDatabaseBusy } from './utilties';

DatabaseStatusWidget.propTypes = {
  databaseStatus: PropTypes.string.isRequired,
};

export default function DatabaseStatusWidget({ databaseStatus, ...restProps }) {
  return (
    <div {...restProps}>
      <FontAwesomeIcon className="mr-1" icon="database" />
      Database:{' '}
      {isDatabaseBusy(databaseStatus) && (
        <React.Fragment>
          <BusySpinner screenReaderText={databaseStatus} />{' '}
        </React.Fragment>
      )}
      <span className={getTextClassName(databaseStatus)}>{databaseStatus}</span>
    </div>
  );
}
