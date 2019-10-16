import PropTypes from 'prop-types';
import React from 'react';

import SVGIcon from '../SVGIcon';

Icon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default function Icon({ type, ...restProps }) {
  return (
    <SVGIcon
      className="align-baseline"
      type={type}
      width="1em"
      height="1em"
      fill="white"
      {...restProps}
    />
  );
}
