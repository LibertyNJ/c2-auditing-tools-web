import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Navigation from './Navigation';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  databaseStatus: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

export default function Layout({ children, databaseStatus, version }) {
  return (
    <div className="d-flex flex-column vh-100">
      <Navigation className="flex-grow-0 flex-shrink-0 mb-3" />
      {children}
      <Footer
        className="flex-grow-0 flex-shrink-0"
        databaseStatus={databaseStatus}
        version={version}
      />
    </div>
  );
}
