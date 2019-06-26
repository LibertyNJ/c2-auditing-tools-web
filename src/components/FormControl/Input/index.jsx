import React from 'react';
import PropTypes from 'prop-types';

import InputGroup from './InputGroup';
import HelpText from '../../HelpText';

Input.propTypes = {
  helpText: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
};

Input.defaultProps = {
  helpText: undefined,
  wrapperClassName: undefined,
};

export default function Input({
  wrapperClassName, label, helpText, ...restProps
}) {
  return (
    <div className={`form-group col ${wrapperClassName}`}>
      <label htmlFor={restProps.name}>{label}</label>
      <InputGroup {...restProps} />
      {helpText && <HelpText text={helpText} />}
    </div>
  );
}
