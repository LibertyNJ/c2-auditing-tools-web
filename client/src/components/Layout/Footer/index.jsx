import PropTypes from 'prop-types';
import React from 'react';

import CopyrightWidget from './CopyrightWidget';
import VersionWidget from './VersionWidget';
import { reduceClassNames } from '../../../util';

const BASE_CLASS_NAME = 'bg-dark d-flex justify-content-between px-3 py-1 text-light';

Footer.propTypes = {
  className: PropTypes.string,
};

export default function Footer({ className, ...restProps }) {
  return (
    <footer className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      <VersionWidget />
      <CopyrightWidget />
    </footer>
  );
}
