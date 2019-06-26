import React from 'react';
import PropTypes from 'prop-types';

import VersionWidget from './VersionWidget';
import DatabaseStatusWidget from './DatabaseStatusWidget';

Footer.propTypes = {
  databaseStatus: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

export default function Footer({ version, databaseStatus }) {
  return (
    <footer className="container-fluid flex-shrink-0 d-flex justify-content-between text-light bg-dark px-3 py-1">
      <VersionWidget version={version} />
      <DatabaseStatusWidget databaseStatus={databaseStatus} />
    </footer>
  );
}
