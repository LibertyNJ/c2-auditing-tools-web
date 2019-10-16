import PropTypes from 'prop-types';
import React from 'react';

import BusySpinner from './BusySpinner';
import Icon from './Icon';
import { reduceClassNames } from '../../util';

Button.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  iconType: PropTypes.string.isRequired,
};

Button.defaultProps = {
  disabled: false,
};

export default function Button({
  children, className, disabled, iconType,
}) {
  return (
    <button className={reduceClassNames('btn', className)}>
      {disabled ? <BusySpinner /> : <Icon type={iconType} />} {children}
    </button>
  );
}
