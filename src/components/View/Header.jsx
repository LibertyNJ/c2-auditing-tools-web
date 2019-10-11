import React from 'react';
import PropTypes from 'prop-types';

Header.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Header.defaultProps = {
  className: '',
};

export default function Header({ children, className }) {
  return (
    <header>
      <h1 className={`text-primary text-center ${className}`}>{children}</h1>
    </header>
  );
}
