import { connect } from 'react-redux';

import { sortRecords } from '../actions';
import Table from '../../components/Table';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table);

function mapStateToProps(state, ownProps) {
  return {
    rowCount: getRowCount(state, ownProps.view),
    rowGetter: ({ index }) => getRow(state, ownProps.view, index),
    sortBy: getViewStateByName(state, ownProps.view, 'sortBy'),
    sortDirection: getViewStateByName(state, ownProps.view, 'sortDirection'),
  };
}

function getRowCount(state, view) {
  return state.views[view].records.length;
}

function getRow(state, view, index) {
  return state.views[view].records[index];
}

function getViewStateByName(state, view, name) {
  return state.views[view][name];
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    sort: ({ sortBy, sortDirection }) => handleSort(dispatch, ownProps.view, sortBy, sortDirection),
  };
}

function handleSort(dispatch, view, sortBy, sortDirection) {
  dispatch(sortRecords(view, sortBy, sortDirection));
}
