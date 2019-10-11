import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../../../SVGIcon';
import BusySpinner from './BusySpinner';

import { getTextClassName, isDatabaseBusy } from './utilties';

DatabaseStatusWidget.propTypes = {
  className: PropTypes.string,
  databaseStatus: PropTypes.string.isRequired,
};

DatabaseStatusWidget.defaultProps = {
  className: null,
};

export default function DatabaseStatusWidget({ className, databaseStatus }) {
  return (
    <div className={className}>
      <SVGIcon className="align-baseline" fill="white" height="1em" type="database" width="1em" />{' '}
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
