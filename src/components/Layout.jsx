import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import SVGIcon from './SVGIcon';

const Layout = ({ children }, props) => (
  <div className="d-flex flex-column vh-100">
    <Header />
    <main className="container-fluid d-flex flex-column flex-grow-1">
      {children}
    </main>
    <Footer {...props} />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const Header = () => (
  <header className="container-fluid flex-shrink-0 sticky-top bg-white p-0 mb-3">
    <Navigation />
  </header>
);

const Navigation = () => (
  <nav className="d-flex justify-content-between">
    <div className="border-bottom flex-grow-1">
      <div className="navbar-brand text-primary px-3">C2 Auditing Tools</div>
    </div>
    <ul className="nav nav-tabs d-flex justify-content-end">
      <NavItem to="/">Dashboard</NavItem>
      <NavItem to="/ledger">Ledger</NavItem>
      <NavItem to="/transaction">Transactions</NavItem>
      <NavItem to="/administration">Administrations</NavItem>
      <NavItem to="/provider">Providers</NavItem>
      <NavItem to="/data">Data</NavItem>
    </ul>
  </nav>
);

const NavItem = ({ to, children }) => (
  <li className="nav-item">
    <NavLink exact to={to}>
      {children}
    </NavLink>
  </li>
);

const Footer = ({ version, databaseStatus }) => (
  <footer className="container-fluid flex-shrink-0 d-flex justify-content-between text-light bg-dark px-3 py-1">
    <VersionWidget version={version} />
    <DatabaseStatusWidget databaseStatus={databaseStatus} />
  </footer>
);

const VersionWidget = ({ version }) => (
  <div className="mb-0">Version: {version}</div>
);

const DatabaseStatusWidget = ({ databaseStatus }) => {
  const databaseStatusClass = getDatabaseStatusClass(databaseStatus);

  return (
    <div className="mb-0">
      <SVGIcon
        className="align-baseline"
        type="database"
        width="1em"
        height="1em"
        fill="white"
      />{' '}
      Database:{' '}
      {databaseStatusClass === 'text-warning' && (
        <BusyStatusSpinner databaseStatus={databaseStatus} />
      )}
      <span className={databaseStatusClass}>{databaseStatus}</span>
    </div>
  );
};

const BusyStatusSpinner = ({ databaseStatus }) => (
  <React.Fragment>
    <div
      className="spinner-grow text-warning align-baseline"
      role="status"
      style={{ width: '1em', height: '1em' }}
    >
      <span className="sr-only">{databaseStatus}</span>
    </div>{' '}
  </React.Fragment>
);

function getDatabaseStatusClass(databaseStatus) {
  switch (databaseStatus) {
    case 'Ready':
      return 'text-success';
    case 'Error':
    case 'Unknown':
      return 'text-danger';
    default:
      return 'text-warning';
  }
}

export default Layout;
