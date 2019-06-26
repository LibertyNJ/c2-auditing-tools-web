import React from 'react';
import PropTypes from 'prop-types';

import PrependGroup from './PrependGroup';
import AppendGroup from './AppendGroup';

InputGroup.propTypes = {
  append: PropTypes.node,
  attributes: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  prepend: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

InputGroup.defaultProps = {
  append: undefined,
  attributes: undefined,
  disabled: false,
  prepend: undefined,
  value: '',
};

export default function InputGroup(props) {
  const InputElement = props.type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="input-group flex-nowrap">
      {props.prepend && <PrependGroup>{props.prepend}</PrependGroup>}
      <InputElement
        id={props.name}
        className="form-control"
        type={props.type === 'textarea' ? undefined : props.type}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={props.handleChange}
        {...props.attributes}
      />
      {props.append && <AppendGroup>{props.append}</AppendGroup>}
    </div>
  );
}
