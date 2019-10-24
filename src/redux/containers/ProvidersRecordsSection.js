import { connect } from 'react-redux';

import RecordsTable from './RecordsTable';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordsTable);

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onRowClick: ({ rowData }) => handleRowClick(rowData, dispatch),
  };
}

function handleRowClick(rowData, dispatch) {
  const providerId = rowData.id;
  const message = {
    body: providerId,
    channel: 'get-provider-modal',
  };
}
