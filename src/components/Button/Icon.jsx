import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../SVGIcon';

Icon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default function Icon({ type }) {
  return <SVGIcon className="align-baseline" type={type} width="1em" height="1em" fill="white" />;
}
