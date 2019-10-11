import React from 'react';
import PropTypes from 'prop-types';

Header.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.number.isRequired,
};

export default function Header({ children, level }) {
  const Heading = `h${level}`;
  return (
    <header>
      <Heading className="text-primary">{children}</Heading>
    </header>
  );
}
