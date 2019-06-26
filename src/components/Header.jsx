import React from 'react';
import PropTypes from 'prop-types';

Header.propTypes = {
  children: PropTypes.string.isRequired,
};

export default function Header({ children }) {
  return (
    <header className="col">
      <h1 className="text-primary text-center">{children}</h1>
    </header>
  );
}
