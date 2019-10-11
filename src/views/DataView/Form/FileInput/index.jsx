import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Label from './Label';

FileInput.propTypes = {
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

FileInput.defaultProps = {
  disabled: false,
  value: '',
  wrapperClassName: '',
};

export default function FileInput({
  label, name, value, wrapperClassName, ...restProps
}) {
  return (
    <div className={`custom-file ${wrapperClassName}`}>
      <Input name={name} value={value} {...restProps} />
      <Label htmlFor={name} value={value}>
        {label}
      </Label>
    </div>
  );
}
