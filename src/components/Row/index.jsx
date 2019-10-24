import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../util';

export const BASE_CLASS_NAME = 'row';

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function Row({ children, className, ...restProps }) {
  return (
    <div className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      {children}
    </div>
  );
}
