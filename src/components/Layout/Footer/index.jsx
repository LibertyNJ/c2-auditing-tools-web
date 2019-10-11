import React from 'react';
import PropTypes from 'prop-types';

import DatabaseStatusWidget from './DatabaseStatusWidget';
import VersionWidget from './VersionWidget';

Footer.propTypes = {
  className: PropTypes.string,
  databaseStatus: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

Footer.defaultProps = {
  className: null,
};

export default function Footer({ className, databaseStatus, version }) {
  return (
    <footer
      className={`d-flex justify-content-between text-light bg-dark px-3 py-1 ${className}`}
    >
      <VersionWidget version={version} />
      <DatabaseStatusWidget databaseStatus={databaseStatus} />
    </footer>
  );
}
