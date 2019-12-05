import PropTypes from 'prop-types';
import React from 'react';
import { reduceClassNames } from '../../../util';

const BASE_CLASS_NAME = 'd-flex flex-column overflow-hidden pt-3 px-3';

Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function Body({ children, className, ...restProps }) {
  return (
    <main className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      {children}
    </main>
  );
}
