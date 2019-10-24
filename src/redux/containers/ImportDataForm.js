import { connect } from 'react-redux';

import Form from '../../components/Form';
import { createRequest, sendBackendRequest } from '../../util';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Form);

function mapStateToProps(state) {
  return {
    paths: {
      c2ActivityReportPath: state.forms.importData.fields.c2ActivityReportPath,
      medicationOrderTaskStatusDetailReportPath:
        state.forms.importData.fields.medicationOrderTaskStatusDetailReportPath,
    },
  };
}

function mapDispatchToProps() {
  return {};
}

function mergeProps({ paths }, dispatchProps, { id, ...restOwnProps }) {
  return {
    id,
    onSubmit: event => handleSubmit(event, paths),
    ...restOwnProps,
  };
}

function handleSubmit(event, paths) {
  event.preventDefault();
  const request = createRequest('POST', 'data', { ...paths });
  sendBackendRequest(request);
}
