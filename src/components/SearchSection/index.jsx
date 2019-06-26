import React from 'react';

import Header from './Header';
import Form from './Form';

export default function SearchSection(props) {
  return (
    <section className="col-3 d-flex flex-column">
      <Header />
      <Form {...props} />
    </section>
  );
}
