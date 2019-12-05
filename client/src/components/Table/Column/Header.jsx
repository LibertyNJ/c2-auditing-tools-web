import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

Header.propTypes = {
  dataKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string,
};

Header.defaultProps = {
  sortDirection: null,
};

export default function Header({
  dataKey, label, sortBy, sortDirection,
}) {
  const sortIcon = isActiveColumn(sortBy, dataKey) ? getSortIconType(sortDirection) : 'sort';
  return (
    <span className="ReactVirtualized__Table__headerTruncatedText" title={label}>
      {label}
      &nbsp;
      <FontAwesomeIcon icon={sortIcon} />
    </span>
  );
}

function isActiveColumn(sortBy, dataKey) {
  return sortBy === dataKey;
}

function getSortIconType(sortDirection) {
  switch (sortDirection) {
    case 'ASC':
      return 'sort-up';
    case 'DESC':
      return 'sort-down';
    default:
      throw new Error(`Table Column Header received invalid sortDirection: "${sortDirection}".`);
  }
}
