import PropTypes from 'prop-types';
import React from 'react';

import CloseButton from './CloseButton';
import { reduceClassNames } from '../../util';

Header.propTypes = {
  className: PropTypes.string,
  heading: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default function Header({
  className, heading, hideModal, ...restProps
}) {
  return (
    <header className={reduceClassNames('modal-header', className)} {...restProps}>
      <h2 className="modal-title text-primary" id="modal-title">
        {heading}
      </h2>
      <CloseButton handleClick={hideModal} />
    </header>
  );
}
