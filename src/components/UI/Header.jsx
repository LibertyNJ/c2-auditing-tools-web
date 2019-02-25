import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <header className="d-print-none container-fluid p-3 border-bottom mb-3 shadow-sm flex-shrink-0">
      {props.helpButtonIsEnabled && <HelpButton />}
      <h1 className="text-center text-primary">{props.heading}</h1>
    </header>
  );
}

Header.propTypes = {
  heading: PropTypes.string.isRequired,
  helpButtonIsEnabled: PropTypes.bool,
};

Header.defaultProps = {
  helpButtonIsEnabled: false,
};

function HelpButton() {
  return (
    <Link to="/help" target="_blank">
      <button className="btn btn-secondary btn-lg float-right">Help</button>
    </Link>
  );
}

export default Header;
