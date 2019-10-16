import 'bootstrap-select';
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Info from '../Info';
import { reduceClassNames } from '../../util';

// Use of jQuery here and in hooks below is to make bootstrap-select
// compatible with react-router-dom. Bootstrap-select's class implementation
// only auto-initializes on page load. Switching routes causes problems.
$.fn.selectpicker.Constructor.BootstrapVersion = '4';

Select.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  info: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
};

export default function Select({
  children,
  className,
  info,
  label,
  labelClassName,
  name,
  wrapperClassName,
  ...restProps
}) {
  const location = useLocation();
  useEffect(() => {
    $('.selectpicker').selectpicker();
  }, [location]);
  return (
    <div className={reduceClassNames('form-group', wrapperClassName)}>
      {label && (
        <label className={reduceClassNames('text-nowrap', labelClassName)} htmlFor={name}>
          {label}
        </label>
      )}
      <select
        className={reduceClassNames('selectpicker', className)}
        data-none-selected-text=""
        data-style=""
        data-style-base="form-control"
        id={name}
        name={name}
        {...restProps}
      >
        {children}
      </select>
      {info && <Info>{info}</Info>}
    </div>
  );
}
