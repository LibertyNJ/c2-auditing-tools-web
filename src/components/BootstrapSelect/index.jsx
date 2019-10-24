import 'bootstrap-select';
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Select from '../Select';
import { reduceClassNames } from '../../util';

$.fn.selectpicker.Constructor.BootstrapVersion = '4';

const BASE_CLASS_NAME = 'selectpicker';

BootstrapSelect.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default function BootstrapSelect({
  children, className, name, ...restProps
}) {
  useEffect(initializeBootstrapSelect, []);
  useEffect(refreshBootstrapSelect);
  return (
    <Select
      className={reduceClassNames(BASE_CLASS_NAME, className)}
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

export function initializeBootstrapSelect() {
  $('.selectpicker').selectpicker();
}

function refreshBootstrapSelect() {
  $('.selectpicker').selectpicker('refresh');
}
