import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/balance">Balance</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
