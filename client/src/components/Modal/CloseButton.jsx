import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

CloseButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default function CloseButton({ handleClick, ...restProps }) {
  return (
    <button
      aria-label="Close"
      className="close"
      onClick={handleClick}
      title="Close"
      type="button"
      {...restProps}
    >
      <FontAwesomeIcon icon="times" />
    </button>
  );
}
