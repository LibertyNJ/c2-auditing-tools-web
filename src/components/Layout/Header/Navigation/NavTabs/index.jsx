import React from 'react';

import NavItem from './NavItem';

export default function NavTabs() {
  return (
    <ul className="nav nav-tabs d-flex justify-content-end">
      <NavItem to="/">Dashboard</NavItem>
      <NavItem to="/ledger">Ledger</NavItem>
      <NavItem to="/transaction">Transactions</NavItem>
      <NavItem to="/administration">Administrations</NavItem>
      <NavItem to="/provider">Providers</NavItem>
      <NavItem to="/data">Data</NavItem>
    </ul>
  );
}
