import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../../util';

const BASE_CLASS_NAME = 'nav nav-tabs d-flex flex-nowrap justify-content-end';

NavTabs.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function NavTabs({ children, className, ...restProps }) {
  return (
    <ul className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      {children}
    </ul>
  );
}
