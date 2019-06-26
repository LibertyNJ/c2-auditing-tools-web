import React from 'react';

import Header from './Header';
import Table from './Table';

export default function RecordsSection(props) {
  return (
    <section className="col-9 d-flex flex-column">
      <Header />
      <Table {...props} />
    </section>
  );
}
