
import React from 'react';

import Wrapper from './Wrapper';
import Header from '../../components/Header';
import Instructions from './Instructions';
import Form from './Form';

export default function DataView() {
  return (
    <Wrapper>
      <Header>Data</Header>
      <Instructions />
      <Form />
    </Wrapper>
  );
}
