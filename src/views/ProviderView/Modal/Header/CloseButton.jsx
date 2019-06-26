import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../../../../components/SVGIcon';

CloseButton.propTypes = {
  hide: PropTypes.func.isRequired,
};

export default function CloseButton({ hide }) {
  return (
    <button
      type="button"
      className="close p-0"
      aria-label="Close"
      onClick={hide}
    >
      <SVGIcon
        className="align-baseline"
        type="window-close"
        width="1em"
        height="1em"
        fill="red"
      />
    </button>
  );
}
