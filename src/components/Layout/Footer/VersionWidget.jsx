import React from 'react';
import PropTypes from 'prop-types';

VersionWidget.propTypes = {
  className: PropTypes.string,
  version: PropTypes.string.isRequired,
};

VersionWidget.defaultProps = {
  className: null,
};

export default function VersionWidget({ className, version }) {
  return <div className={className}>Version: {version}</div>;
}
