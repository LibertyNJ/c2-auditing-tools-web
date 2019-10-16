'use-strict';

import PropTypes from 'prop-types';
import React from 'react';

import PendGroup from './PendGroup';
import { reduceClassNames } from '../../../util';

InputGroup.propTypes = {
  append: PropTypes.node,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  prepend: PropTypes.node,
  type: PropTypes.string.isRequired,
};

export default function InputGroup({
  append, className, name, prepend, type, ...restProps
}) {
  const InputElement = type === 'textarea' ? 'textarea' : 'input';
  return (
    <div className="flex-nowrap input-group">
      {prepend && <PendGroup type="prepend">{prepend}</PendGroup>}
      <InputElement
        className={reduceClassNames('form-control', className)}
        id={name}
        name={name}
        type={type}
        {...restProps}
      />
      {append && <PendGroup type="append">{append}</PendGroup>}
    </div>
  );
}
