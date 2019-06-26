import React from 'react';

import ProviderName from './ProviderName';
import Form from './Form';

export default function Body() {
  return (
    <div className="modal-body">
      <ProviderName />
      <Form />
    </div>
  );
};
