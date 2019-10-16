import PropTypes from 'prop-types';
import React from 'react';

import BusySpinner from './BusySpinner';
import SVGIcon from '../../../SVGIcon';

import { getTextClassName, isDatabaseBusy } from './utilties';

DatabaseStatusWidget.propTypes = {
  databaseStatus: PropTypes.string.isRequired,
};

export default function DatabaseStatusWidget({ databaseStatus, ...restProps }) {
  return (
    <div {...restProps}>
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
