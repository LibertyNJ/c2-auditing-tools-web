import PropTypes from 'prop-types';
import React from 'react';

import Brand from './Brand';
import NavItem from './NavItem';
import NavTabs from './NavTabs';
import { reduceClassNames } from '../../../util';

Navigation.propTypes = {
  className: PropTypes.string,
};

export default function Navigation({ className, ...restProps }) {
  return (
    <nav className={reduceClassNames('d-flex', className)} {...restProps}>
      <Brand className="flex-grow-1 flex-shrink-0 mr-0">C2 Auditing Tools</Brand>
      <NavTabs className="flex-grow-0 flex-shrink-0">
        <NavItem to="/">Ledger</NavItem>
        <NavItem to="/transaction">Transactions</NavItem>
        <NavItem to="/administration">Administrations</NavItem>
        {/* <NavItem to="/provider">Providers</NavItem>
        <NavItem to="/data">Data</NavItem> */}
      </NavTabs>
    </nav>
  );
}
