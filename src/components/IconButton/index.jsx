import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { reduceClassNames } from '../../util';

const BASE_CLASS_NAME = 'btn d-block';

IconButton.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

export default function IconButton({
  children, className, icon, ...restProps
}) {
  return (
    <button className={reduceClassNames(BASE_CLASS_NAME, className)} {...restProps}>
      <FontAwesomeIcon className="mr-1" icon={icon} />
      {children}
    </button>
  );
}
