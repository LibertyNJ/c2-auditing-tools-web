import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';

const RecordsTableSection = props => {
  const tableHeadHeadings = props.columnHeadings.map(columnHeading => {
    const getSortIconType = () => {
      if (columnHeading.orderByColumn === props.orderByColumn) {
        switch (props.orderByDirection) {
          case 'ASC':
            return 'sort-up';
          case 'DESC':
            return 'sort-down';
          default:
            return 'sort';
        }
      }

      return 'sort';
    };

    return (
      <th
        key={columnHeading.name}
        className="sticky-top bg-white p-0 border-top-0 border-bottom-0 border-right"
        scope="col"
      >
        <button
          className="btn btn-link text-reset font-weight-bold d-block w-100 h-100 border-bottom rounded-0"
          type="button"
          data-order-by-column={columnHeading.orderByColumn}
          onClick={props.handleClick}
        >
          {columnHeading.name}&nbsp;
          <SVGIcon
            className="align-baseline"
            type={getSortIconType()}
            width={'1em'}
            height={'1em'}
          />
        </button>
      </th>
    );
  });

  const tableClassName = `table table-sm mb-3 border-bottom border-left ${
    props.className
  }`;

  return (
    <section className="col-9 d-flex flex-column">
      <h2>Records</h2>
      <div className="overflow-auto border-top">
        <table className={tableClassName}>
          <thead>
            <tr className="border-0">{tableHeadHeadings}</tr>
          </thead>
          <tbody>{props.tableBodyRows}</tbody>
        </table>
      </div>
    </section>
  );
};

RecordsTableSection.propTypes = {
  orderByColumn: PropTypes.string.isRequired,
  orderByDirection: PropTypes.string.isRequired,
  columnHeadings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      orderByColumn: PropTypes.string.isRequired,
    })
  ).isRequired,
  tableBodyRows: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

RecordsTableSection.defaultProps = {
  className: '',
};

export default RecordsTableSection;
