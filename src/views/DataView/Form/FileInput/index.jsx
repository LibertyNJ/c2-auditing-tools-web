import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Label from './Label';

FileInput.propTypes = {
  attributes: PropTypes.objectOf(PropTypes.any),
  handleChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

FileInput.defaultProps = {
  attributes: null,
  isDisabled: false,
  value: undefined,
};

export default function FileInput({ label, ...restProps }) {
  return (
    <div className="col custom-file mb-3">
      <Input {...restProps} />
      <Label htmlFor={restProps.name} value={restProps.value}>{label}</Label>
    </div>
  );
}
