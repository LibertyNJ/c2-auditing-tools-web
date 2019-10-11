import React from 'react';
import PropTypes from 'prop-types';

import HelpText from './HelpText';

Select.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  helpText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

Select.defaultProps = {
  children: null,
  disabled: false,
  handleChange: null,
  helpText: null,
  label: null,
  value: [],
};

export default function Select({
  children,
  disabled,
  handleChange,
  helpText,
  label,
  name,
  value,
  ...restProps
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        className="custom-select overflow-auto"
        disabled={disabled}
        id={name}
        name={name}
        onChange={handleChange}
        value={value}
        {...restProps}
      >
        {children}
      </select>
      {helpText && <HelpText text={helpText} />}
    </div>
  );
}
