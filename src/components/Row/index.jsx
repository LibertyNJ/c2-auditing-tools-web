'use-strict';

import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../util';

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const BASE_CLASS_NAME = 'row';

export default function Row({ children, className, ...restProps }) {
  return (
    <div className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      {children}
    </div>
  );
}
