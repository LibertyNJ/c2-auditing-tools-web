import React from 'react';
import PropTypes from 'prop-types';

import Table from '../Table';

RecordsSection.propTypes = {
  channel: PropTypes.string.isRequired,
  className: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      maxWidth: PropTypes.number,
    }),
  ).isRequired,
  handleTableRowClick: PropTypes.func,
};

RecordsSection.defaultProps = {
  className: null,
  handleTableRowClick: null,
};

export default function RecordsSection({
  channel, className, columns, handleTableRowClick,
}) {
  return (
    <section className={`d-flex flex-column ${className}`}>
      <Table
        channel={channel}
        columns={columns}
        handleTableRowClick={handleTableRowClick}
        wrapperClassName="flex-grow-1 flex-shrink-1"
      />
    </section>
  );
}
