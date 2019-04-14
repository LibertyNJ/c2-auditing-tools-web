import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

const getDatabaseStatusClass = databaseStatus => {
  switch (databaseStatus) {
    case 'Ready':
      return 'text-success';
    case 'Error':
    case 'Unknown':
      return 'text-danger';
    default:
      return 'text-warning';
  }
};

const Layout = props => {
  const databaseStatusClass = getDatabaseStatusClass(props.databaseStatus);

  return (
    <div className="d-flex flex-column vh-100">
      <header className="container-fluid sticky-top bg-white p-0 mb-3 shadow-sm">
        <nav className="navbar navbar-expand navbar-light">
          <Link className="navbar-brand" to="/">
            C2 Auditing Tools
          </Link>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ledger">
                Ledger
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transaction">
                Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/administration">
                Administrations
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/provider">
                Providers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/data">
                Data
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container-fluid d-flex flex-column">{props.children}</main>
      <footer className="container-fluid flex-shrink-0 d-flex justify-content-between text-light bg-dark px-3 py-1 mt-auto">
        <p className="mb-0">Version: {props.version}</p>
        <p className="mb-0">
          Database:{' '}
          <span className={databaseStatusClass}>{props.databaseStatus}</span>
        </p>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  databaseStatus: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

export default Layout;
