import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../../util';

const BASE_CLASS_NAME = 'border-bottom navbar-brand px-3 text-primary';

Brand.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default function Brand({ children, className, ...restProps }) {
  return (
    <div className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      {children}
    </div>
  );
}
