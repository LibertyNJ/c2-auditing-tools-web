import React from 'react';
import PropTypes from 'prop-types';

import Brand from './Brand';
import NavItem from './NavItem';
import NavTabs from './NavTabs';

Navigation.propTypes = {
  className: PropTypes.string,
};

Navigation.defaultProps = {
  className: '',
};

export default function Navigation({ className }) {
  return (
    <nav className={`d-flex ${className}`}>
      <Brand className="flex-grow-1 flex-shrink-0 mr-0">C2 Auditing Tools</Brand>
      <NavTabs className="flex-grow-0 flex-shrink-0">
        <NavItem to="/">Ledger</NavItem>
        <NavItem to="/transaction">Transactions</NavItem>
        <NavItem to="/administration">Administrations</NavItem>
        <NavItem to="/provider">Providers</NavItem>
        <NavItem to="/data">Data</NavItem>
      </NavTabs>
    </nav>
  );
}
