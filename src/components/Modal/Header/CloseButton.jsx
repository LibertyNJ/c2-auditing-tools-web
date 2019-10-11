import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../../SVGIcon';

CloseButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default function CloseButton({ handleClick }) {
  return (
    <button aria-label="Close" className="close p-0" onClick={handleClick} type="button">
      <SVGIcon className="align-baseline" fill="red" height="1em" type="window-close" width="1em" />
    </button>
  );
}
