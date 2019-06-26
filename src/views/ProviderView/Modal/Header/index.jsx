import React from 'react';

import CloseButton from './CloseButton';

export default function Header(props) {
  return (
    <header className="modal-header">
      <h3 id="modal-title" className="text-primary modal-title">Edit Provider</h3>
      <div className="p-3">
        <CloseButton {...props} />
      </div>
    </header>
  );
}
