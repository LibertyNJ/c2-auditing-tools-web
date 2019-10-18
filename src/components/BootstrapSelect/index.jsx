import 'bootstrap-select';
import PropTypes from 'prop-types';
import React from 'react';

import Select from '../Select';
import { reduceClassNames } from '../../util';

BootstrapSelect.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default function BootstrapSelect({
  children, className, name, ...restProps
}) {
  return (
    <Select
      className={reduceClassNames('selectpicker', className)}
      data-none-selected-text=""
      data-selected-text-format="count"
      data-style=""
      data-style-base="form-control"
      name={name}
      {...restProps}
    >
      {children}
    </Select>
  );
}
