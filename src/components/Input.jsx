import PropTypes from 'prop-types';
import React from 'react';

import SVGIcon from './SVGIcon';

const Input = (props) => {
  const InputElement = props.type === 'textarea' ? 'textarea' : 'input';
  return (
    <div className={`form-group col ${props.wrapperClassName}`}>
      <label htmlFor={props.name}>{props.label}</label>
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
      {props.helpText && <HelpText text={props.helpText} />}
    </div>
  );
};

Input.propTypes = {
  append: PropTypes.node,
  attributes: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  helpText: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prepend: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

Input.defaultProps = {
  append: undefined,
  attributes: undefined,
  disabled: false,
  helpText: undefined,
  prepend: undefined,
  value: '',
  wrapperClassName: undefined,
};

const PrependGroup = ({ children }) => <div className="input-group-prepend">{children}</div>;

PrependGroup.propTypes = {
  children: PropTypes.node,
};

PrependGroup.defaultProps = {
  children: undefined,
};

const AppendGroup = ({ children }) => <div className="input-group-append">{children}</div>;

AppendGroup.propTypes = {
  children: PropTypes.node,
};

AppendGroup.defaultProps = {
  children: undefined,
};

const HelpText = ({ text }) => (
  <small className="form-text text-info text-nowrap">
    <SVGIcon
      className="align-baseline"
      type="info-circle"
      width="1em"
      height="1em"
      fill="#17b2a8"
    />{' '}
    {text}
  </small>
);

HelpText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Input;
