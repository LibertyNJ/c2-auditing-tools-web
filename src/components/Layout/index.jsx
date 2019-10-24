import PropTypes from 'prop-types';
import React from 'react';

import Body from './Body';
import Footer from './Footer';
import Navigation from './Navigation';
import { reduceClassNames } from '../../util';

const BASE_CLASS_NAME = 'd-flex flex-column vh-100';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function Layout({ children, className, ...restProps }) {
  return (
    <div className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      <Navigation className="flex-grow-0 flex-shrink-0" />
      <Body className="flex-grow-1 flex-shrink-1">{children}</Body>
      <Footer className="flex-grow-0 flex-shrink-0" />
    </div>
  );
}
