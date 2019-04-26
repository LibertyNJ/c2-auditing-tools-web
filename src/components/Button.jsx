import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';

const Button = (props) => {
  const className = `btn btn-${props.color} ${props.className}`;

  if (props.disabled) {
    return (
      <button className={className} type={props.type} disabled>
        <div
          className="spinner-border text-white align-baseline"
          role="status"
          style={{ width: '1em', height: '1em' }}
        >
          <span className="sr-only">{props.text}ing…</span>
        </div>{' '}
        {props.text}ing…
      </button>
    );
  }

  return (
    <button className={className} type={props.type}>
      {props.icon && (
        <React.Fragment>
          <SVGIcon
            className="align-baseline"
            type={props.icon}
            width="1em"
            height="1em"
            fill="white"
          />{' '}
        </React.Fragment>
      )}
      {props.text}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  className: '',
};

export default Button;
