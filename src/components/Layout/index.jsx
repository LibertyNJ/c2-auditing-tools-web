import PropTypes from 'prop-types';
import React from 'react';

import Body from './Body';
import Footer from './Footer';
import Navigation from './Navigation';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Layout({ children, ...restProps }) {
  return (
    <div className="d-flex flex-column vh-100" {...restProps}>
      <Navigation className="flex-grow-0 flex-shrink-0" />
      <Body className="flex-grow-1 flex-shrink-1">{children}</Body>
      <Footer className="flex-grow-0 flex-shrink-0" />
    </div>
  );
}
