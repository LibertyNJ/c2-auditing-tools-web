import React from 'react';
import PropTypes from 'prop-types';

import InputGroup from './InputGroup';
import HelpText from '../HelpText';

Input.propTypes = {
  helpText: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
};

Input.defaultProps = {
  helpText: null,
  wrapperClassName: null,
};

export default function Input({
  helpText, label, name, wrapperClassName, ...restProps
}) {
  return (
    <div className={`form-group ${wrapperClassName}`}>
      <label htmlFor={name}>{label}</label>
      <InputGroup name={name} {...restProps} />
      {helpText && <HelpText text={helpText} />}
    </div>
  );
}
