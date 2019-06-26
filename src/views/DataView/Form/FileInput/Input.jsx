import React from 'react';
import PropTypes from 'prop-types';

Input.propTypes = {
  attributes: PropTypes.objectOf(PropTypes.any),
  handleChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

Input.defaultProps = {
  attributes: null,
  isDisabled: false,
  value: undefined,
};

export default function Input({ name, value, isDisabled, handleChange, attributes }) {
  return (
    <input
      id={name}
      className="custom-file-input"
      type="file"
      name={name}
      value={value}
      disabled={isDisabled}
      onChange={handleChange}
      {...attributes}
    />
  );
}
