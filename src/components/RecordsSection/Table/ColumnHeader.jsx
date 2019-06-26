import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../../SVGIcon';

ColumnHeader.propTypes = {
  dataKey: PropTypes.string,
  label: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string,
};

ColumnHeader.defaultProps = {
  sortDirection: undefined,
};

export default function ColumnHeader({
  sortBy, sortDirection, label, dataKey,
}) {
  const sortIconType = assignSortIconType(sortBy, dataKey, sortDirection);

  return (
    <span className="ReactVirtualized__Table__headerTruncatedText" title={label}>
      {label}
      &nbsp;
      <SVGIcon
        className="align-baseline"
        type={sortIconType}
        width="1em"
        height="1em"
        fill="#53565a"
      />
    </span>
  );
}

function assignSortIconType(sortBy, dataKey, sortDirection) {
  if (isActiveColumn(sortBy, dataKey)) {
    return getSortIconType(sortDirection);
  }

  return 'sort';
}

function isActiveColumn(sortBy, dataKey) {
  return sortBy === dataKey;
}

export function getSortIconType(sortDirection) {
  switch (sortDirection) {
    case 'ASC':
      return 'sort-up';
    case 'DESC':
      return 'sort-down';
    default:
      return 'sort';
  }
}
