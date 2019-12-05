import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../util';

export const BASE_CLASS_NAME = 'form-row';

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function FormRow({ children, className, ...restProps }) {
  return (
    <div className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      {children}
    </div>
  );
}
