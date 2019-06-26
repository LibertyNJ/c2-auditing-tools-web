import React from 'react';
import PropTypes from 'prop-types';

import path from 'path';

Label.propTypes = {
  children: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
  value: PropTypes.string,
};

Label.defaultProps = {
  value: '',
};

export default function Label({ children, htmlFor, value }) {
  return (
    <label className="custom-file-label" htmlFor={htmlFor}>
      {children}: {path.basename(value)}
    </label>
  );
}
