import PropTypes from 'prop-types';
import React from 'react';

import { getViewBox, getD } from './utilities';

SVGIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.string),
  type: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

SVGIcon.defaultProps = {
  className: undefined,
  fill: '#fff',
  style: undefined,
};

export default function SVGIcon(props) {
  return (
    <svg
      className={props.className}
      height={props.height}
      style={props.style}
      width={props.width}
      viewBox={getViewBox(props.type)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={getD(props.type)} fill={props.fill} />
    </svg>
  );
}
