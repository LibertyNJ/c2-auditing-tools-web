import React from 'react';
import PropTypes from 'prop-types';

import PendGroup from './PendGroup';

InputGroup.propTypes = {
  append: PropTypes.node,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  prepend: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

InputGroup.defaultProps = {
  append: null,
  disabled: false,
  prepend: null,
  value: '',
};

export default function InputGroup({
  append,
  disabled,
  handleChange,
  name,
  prepend,
  type,
  value,
  ...restProps
}) {
  return (
    <div className="input-group flex-nowrap">
      {prepend && <PendGroup type="prepend">{prepend}</PendGroup>}
      <input
        className="form-control"
        disabled={disabled}
        id={name}
        name={name}
        onChange={handleChange}
        type={type}
        value={value}
        {...restProps}
      />
      {append && <PendGroup type="append">{append}</PendGroup>}
    </div>
  );
}
