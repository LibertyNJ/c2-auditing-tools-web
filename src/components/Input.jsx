import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';

const Input = props => (
  <div className="form-group">
    <label htmlFor={props.name}>{props.label}</label>
    <input
      id={props.name}
      className="form-control"
      type={props.type}
      name={props.name}
      value={props.value}
      onChange={props.handleChange}
      {...props.attributes}
    />
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

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  info: PropTypes.string,
  attributes: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ),
};

Input.defaultProps = {
  info: null,
  attributes: null,
};

export default Input;
