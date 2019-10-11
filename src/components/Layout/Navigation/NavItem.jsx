import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

NavItem.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default function NavItem({ children, to }) {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" exact to={to}>
        {children}
      </NavLink>
    </li>
  );
}
