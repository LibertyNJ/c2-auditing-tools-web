import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  version: PropTypes.string.isRequired,
};

function Footer(props) {
  return (
    <footer
      className="container-fluid d-flex d-print-none justify-content-between
      align-items-center text-white bg-dark p-3 mt-auto flex-shrink-0"
    >
      <img
        className="img-fluid"
        src="./components/UI/Footer/assets/images/nsuh-nwh-logo-inverted.png"
        alt="North Shore University Hospital Logo"
        width="561"
        height="64"
      />
      <div className="">
        <p className="text-right mb-0 ml-auto">Version {props.version}.</p>
        <address className="text-right mb-0">
          Created by Nathaniel J. Liberty, 2019.<br />
          Email <a className="text-secondary" href="mailto:nliberty@northwell.edu?subject=Cytoxan%20Label%20Creator">nliberty@northwell.edu</a> with comments, questions, or bug reports.
        </address>
      </div>
    </footer>
  );
}

Footer.propTypes = propTypes;

export default Footer;
