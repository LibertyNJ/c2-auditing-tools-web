import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

const Layout = props => (
  <div className="d-flex flex-column vh-100">
    <header className="container-fluid sticky-top bg-white p-0 mb-3 shadow-sm">
      <nav className="navbar navbar-expand navbar-light">
        <Link className="navbar-brand" to="/">
          C2 Auditing Tools
        </Link>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Data
            </Link>
          </li>
        </ul>
      </nav>
    </header>
    <main className="container-fluid overflow-auto">{props.children}</main>
    <footer className="container-fluid text-light bg-dark px-3 py-1 mt-auto">
      <p className="mb-0">Version: 0.0.0</p>
    </footer>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
