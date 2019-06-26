import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Select from './Select';

FormControl.propTypes = {
  formControlType: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

FormControl.defaultProps = {
  isDisabled: false,
  value: undefined,
};

export default function FormControl({
  formControlType, value, isDisabled, handleChange, ...restProps
}) {
  const FormControlComponent = getFormControlComponent(formControlType);

  return (
    <FormControlComponent
      value={value}
      isDisabled={isDisabled}
      handleChange={handleChange}
      {...restProps}
    />
  );
}

export function getFormControlComponent(type) {
  switch (type) {
    case 'input':
      return Input;
    case 'select':
      return Select;
    default:
      throw new Error(`Invalid form control type: '${type}'`);
  }
}
