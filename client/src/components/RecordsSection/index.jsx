import PropTypes from 'prop-types';
import React from 'react';

import RecordsTable from '../../redux/containers/RecordsTable';
import { reduceClassNames } from '../../util';

const BASE_CLASS_NAME = 'd-flex flex-grow-1 flex-shrink-1';

RecordsSection.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      maxWidth: PropTypes.number,
    }),
  ).isRequired,
  onRowClick: PropTypes.func,
  tableName: PropTypes.string.isRequired,
};

export default function RecordsSection({
  className, columns, onRowClick, tableName,
}) {
  return (
    <section className={reduceClassNames(BASE_CLASS_NAME, className)}>
      <RecordsTable
        columns={columns}
        name={tableName}
        onRowClick={onRowClick}
        wrapperClassName="flex-grow-1 flex-shrink-1"
      />
    </section>
  );
}
