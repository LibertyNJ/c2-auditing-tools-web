import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Layout({ children, ...restProps }) {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <Main>{children}</Main>
      <Footer {...restProps} />
    </div>
  );
}
