import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Main from './Main';

View.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string.isRequired,
};

export default function View({ children, heading }) {
  return (
    <React.Fragment>
      <Header className="flex-grow-0 flex-shrink-0">{heading}</Header>
      <Main className="flex-grow-1 flex-shrink-1">{children}</Main>
    </React.Fragment>
  );
}
