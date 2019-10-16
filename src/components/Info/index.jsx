'use-strict';

import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

Info.propTypes = {
  children: PropTypes.string.isRequired,
};

export default function Info({ children, ...restProps }) {
  return (
    <small className="form-text text-info text-nowrap" {...restProps}>
      <FontAwesomeIcon icon="info-circle" /> {children}
    </small>
  );
}
