import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { reduceClassNames } from '../../util';

const BASE_CLASS_NAME = 'form-text text-info text-nowrap';

Info.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default function Info({ children, className, ...restProps }) {
  return (
    <small className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      <FontAwesomeIcon icon="info-circle" /> {children}
    </small>
  );
}
