import { Link } from 'react-router-dom';
import React from 'react';

const Header = () => (
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
          <Link className="nav-link" to="/balance">
            Balance
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/transactions">
            Transactions
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pyxis">
            Pyxis
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/administrations">
            Administrations
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/providers">
            Providers
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/data">
            Data
          </Link>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="configure-dropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Configure
          </a>
          <div className="dropdown-menu" aria-labelledby="configure-dropdown">
            <Link className="dropdown-item" to="/configure/providers">
              Providers
            </Link>
            <Link className="dropdown-item" to="/configure/medication-products">
              Medication products
            </Link>
          </div>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/help">
            Help
          </Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
