import React from 'react';
import PropTypes from 'prop-types';

Footer.propTypes = {
  children: PropTypes.node,
};

Footer.defaultProps = {
  children: null,
};

export default function Footer({ children }) {
  return <footer className="modal-footer">{children}</footer>;
}
