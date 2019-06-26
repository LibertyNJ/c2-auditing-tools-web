import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../SVGIcon';

Icon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default function Icon({ type }) {
  return (
    <React.Fragment>
      <SVGIcon className="align-baseline" type={type} width="1em" height="1em" fill="white" />{' '}
    </React.Fragment>
  );
}
