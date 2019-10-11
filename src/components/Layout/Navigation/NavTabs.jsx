import React from 'react';
import PropTypes from 'prop-types';

NavTabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  className: PropTypes.string,
};

NavTabs.defaultProps = {
  className: null,
};

export default function NavTabs({ children, className }) {
  return (
    <ul className={`nav nav-tabs d-flex flex-nowrap justify-content-end ${className}`}>
      {children}
    </ul>
  );
}
