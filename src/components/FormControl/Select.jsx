import React from 'react';
import PropTypes from 'prop-types';

import HelpText from '../HelpText';

Select.propTypes = {
  attributes: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
  handleChange: PropTypes.func.isRequired,
  helpText: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

Select.defaultProps = {
  attributes: undefined,
  helpText: undefined,
  isDisabled: false,
  label: undefined,
  value: [],
};

export default function Select(props) {
  const options = props.options.map(({ value, text }) => (
    <option key={value} value={value}>
      {text}
    </option>
  ));

  return (
    <div className="col form-group">
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <select
        id={props.name}
        className="custom-select"
        name={props.name}
        value={props.value}
        disabled={props.isDisabled}
        onChange={props.handleChange}
        {...props.attributes}
      >
        {options}
      </select>
      {props.helpText && <HelpText text={props.helpText} />}
    </div>
  );
}
