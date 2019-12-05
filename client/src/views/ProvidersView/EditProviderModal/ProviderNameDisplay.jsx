import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../../util';

ProviderNameDisplay.propTypes = {
  className: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  middleInitial: PropTypes.string,
};

export default function ProviderNameDisplay({
  className,
  firstName,
  lastName,
  middleInitial,
  ...restProps
}) {
  return (
    <p className={reduceClassNames('lead', className)} {...restProps}>
      {lastName}, {firstName} {middleInitial}
    </p>
  );
}
