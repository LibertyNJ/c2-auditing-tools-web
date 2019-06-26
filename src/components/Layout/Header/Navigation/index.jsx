import React from 'react';

import Brand from './Brand';
import NavTabs from './NavTabs';

export default function Navigation() {
  return (
    <nav className="d-flex justify-content-between">
      <Brand />
      <NavTabs />
    </nav>
  );
}
