import React from 'react';
import PropTypes from 'prop-types';

import BusySpinner from './BusySpinner';
import Icon from './Icon';

Button.propTypes = {
  bootstrapColor: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  form: PropTypes.string,
  iconType: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

Button.defaultProps = {
  bootstrapColor: 'primary',
  className: '',
  disabled: false,
  form: undefined,
};

export default function Button(props) {
  const className = `btn btn-${props.bootstrapColor} ${props.className}`;

  return (
    <button className={className} type={props.type} disabled={props.disabled} form={props.form}>
      {props.disabled ? <BusySpinner /> : <Icon type={props.iconType} />}
      {props.text}
    </button>
  );
}
