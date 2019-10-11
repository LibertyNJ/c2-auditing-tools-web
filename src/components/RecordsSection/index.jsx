import React from 'react';
import PropTypes from 'prop-types';

import Section from '../Section';
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
    <Section
      className={`d-flex flex-column col-10 ${className}`}
      headerClassName="flex-grow-0 flex-shrink-0"
      heading="Records"
      level={2}
    >
      <Table
        channel={channel}
        columns={columns}
        handleTableRowClick={handleTableRowClick}
        wrapperClassName="flex-grow-1 flex-shrink-1"
      />
    </Section>
  );
}
