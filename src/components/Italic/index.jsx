import PropTypes from 'prop-types';
import React from 'react';

Italics.propTypes = {
  children: PropTypes.string.isRequired,
};

export default function Italics({ children, ...restProps }) {
  return (
    <span className="font-italic" {...restProps}>
      {children}
    </span>
  );
}
