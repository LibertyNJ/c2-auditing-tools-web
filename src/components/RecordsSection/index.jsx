import PropTypes from 'prop-types';
import React from 'react';

import ConnectedTable from '../../redux/containers/ConnectedTable';
import { reduceClassNames } from '../../util';

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
  view: PropTypes.string.isRequired,
};

export default function RecordsSection({
  channel, className, columns, handleTableRowClick, view,
}) {
  return (
    <section className={reduceClassNames('d-flex flex-grow-1 flex-shrink-1', className)}>
      <ConnectedTable
        channel={channel}
        columns={columns}
        handleTableRowClick={handleTableRowClick}
        wrapperClassName="flex-grow-1 flex-shrink-1"
        view={view}
      />
    </section>
  );
}
