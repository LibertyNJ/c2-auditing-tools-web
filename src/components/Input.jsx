import React from 'react';
import PropTypes from 'prop-types';

function Input(props) {
  const InputElement = props.type === 'textarea' ? 'textarea' : 'input';

  if (props.append) {
    const AppendElement = props.append.type;

    return (
      <div>
        <label htmlFor={props.name}>
          {props.label}
        </label>
        <div className="input-group">
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
          <div className="input-group-append">
            <AppendElement {...props.append.props}>{props.append.children}</AppendElement>
          </div>
        </div>
        {props.info ? <small className="form-text text-info">{props.info}</small> : null}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={props.name}>
        {props.label}
      </label>
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
      {props.info ? <small className="form-text text-info">{props.info}</small> : null}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  info: PropTypes.string,
  disabled: PropTypes.bool,
  append: PropTypes.shape({
    type: PropTypes.string,
    props: PropTypes.objectOf(PropTypes.any),
    children: PropTypes.node,
  }),
  attributes: PropTypes.objectOf(PropTypes.any),
  handleChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  info: undefined,
  disabled: undefined,
  append: undefined,
  attributes: undefined,
};

export default Input;
