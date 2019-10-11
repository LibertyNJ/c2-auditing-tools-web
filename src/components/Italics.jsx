import React from 'react';
import PropTypes from 'prop-types';

Italics.propTypes = {
  children: PropTypes.string.isRequired,
};

export default function Italics({ children }) {
  return <span className="font-italic">{children}</span>;
}
