import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';

const Select = props => {
  const options = props.options.map(({ value, text }) => (
    <option key={value} value={value}>
      {text}
    </option>
  ));

  return (
    <div className="form-group">
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
      {props.info && (
        <small className="form-text text-info">
          <SVGIcon
            className="align-baseline"
            type="info-circle"
            width="1em"
            height="1em"
            fill="#17b2a8"
          />{' '}
          {props.info}
        </small>
      )}
    </div>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  isDisabled: PropTypes.bool.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  info: PropTypes.string,
  attributes: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ),
};

Select.defaultProps = {
  label: null,
  info: null,
  attributes: null,
  value: [],
};

export default Select;
