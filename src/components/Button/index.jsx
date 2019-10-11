import React from 'react';
import PropTypes from 'prop-types';

import BusySpinner from './BusySpinner';
import Icon from './Icon';

Button.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  form: PropTypes.string,
  iconType: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

Button.defaultProps = {
  children: null,
  className: null,
  disabled: false,
  form: null,
};

export default function Button({
  children, className, disabled, form, iconType, type,
}) {
  return (
    <button className={`btn ${className}`} disabled={disabled} form={form} type={type}>
      {disabled ? <BusySpinner /> : <Icon type={iconType} />} {children}
    </button>
  );
}
