import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul className="nav nav-tabs">
        <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/balance">Balance</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/transactions">Transactions</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/pyxis">Pyxis</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/administrations">Administrations</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
