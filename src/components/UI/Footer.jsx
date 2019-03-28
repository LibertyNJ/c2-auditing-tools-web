import PropTypes from 'prop-types';
import React from 'react';

function Footer(props) {
  return (
    <footer className="container-fluid text-light bg-dark px-3 py-1 mt-auto">
      <p className="mb-0">Version: {props.version}</p>
    </footer>
  );
}

Footer.propTypes = {
  version: PropTypes.string.isRequired,
};

export default Footer;
