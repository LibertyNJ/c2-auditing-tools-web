import React from 'react';
import PropTypes from 'prop-types';

Brand.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Brand.defaultProps = {
  className: null,
};

export default function Brand({ children, className }) {
  return (
    <div className={`navbar-brand text-primary px-3 border-bottom ${className}`}>{children}</div>
  );
}
