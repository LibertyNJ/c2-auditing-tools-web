import { connect } from 'react-redux';

import { sortTableRecords } from '../actions';
import Table from '../../components/Table';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table);

function mapStateToProps(state, ownProps) {
  return {
    rowCount: getRowCount(state, ownProps.name),
    rowGetter: ({ index }) => getRow(state, ownProps.name, index),
    sortBy: getTableStateByName(state, ownProps.name, 'sortBy'),
    sortDirection: getTableStateByName(state, ownProps.name, 'sortDirection'),
  };
}

function getRowCount(state, table) {
  return state.tables[table].records.length;
}

function getRow(state, table, index) {
  return state.tables[table].records[index];
}

function getTableStateByName(state, table, name) {
  return state.tables[table][name];
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    sort: ({ sortBy, sortDirection }) => handleSort(dispatch, ownProps.name, sortBy, sortDirection),
  };
}

function handleSort(dispatch, table, sortBy, sortDirection) {
  dispatch(sortTableRecords(table, sortBy, sortDirection));
}
