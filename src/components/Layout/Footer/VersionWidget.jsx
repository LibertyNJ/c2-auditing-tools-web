import React from 'react';
import PropTypes from 'prop-types';

VersionWidget.propTypes = {
  version: PropTypes.string.isRequired,
};

export default function VersionWidget({ version }) {
  return <div className="mb-0">Version: {version}</div>;
}
