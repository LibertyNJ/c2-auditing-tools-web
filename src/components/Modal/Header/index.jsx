import React from 'react';
import PropTypes from 'prop-types';

import CloseButton from './CloseButton';

Header.propTypes = {
  children: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
};

export default function Header({ children, hideModal, level }) {
  const Heading = `h${level}`;
  return (
    <header className="modal-header">
      <Heading id="modal-title" className="modal-title text-primary">
        {children}
      </Heading>
      <div className="p-3">
        <CloseButton handleClick={hideModal} />
      </div>
    </header>
  );
}
