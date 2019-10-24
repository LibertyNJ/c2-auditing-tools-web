import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { reduceClassNames } from '../../../util';

NavItem.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
};

export default function NavItem({
  children, className, to, ...restProps
}) {
  return (
    <li className={reduceClassNames('nav-item', className)} {...restProps}>
      <NavLink className="nav-link" exact to={to}>
        {children}
      </NavLink>
    </li>
  );
}
