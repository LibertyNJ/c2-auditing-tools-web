import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from './SVGIcon';

HelpText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default function HelpText({ text }) {
  return (
    <small className="form-text text-info text-nowrap">
      <SVGIcon
        className="align-baseline"
        type="info-circle"
        width="1em"
        height="1em"
        fill="#17b2a8"
      />{' '}
      {text}
    </small>
  );
}
