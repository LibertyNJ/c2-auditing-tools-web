import { connect } from 'react-redux';

import Form from '../../components/Form';
import { createRequest, sendBackendRequest } from '../../util';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Form);

function mapStateToProps(state, ownProps) {
  return {
    fields: state.forms[ownProps.id].fields,
  };
}

function mapDispatchToProps() {
  return {};
}

function mergeProps({ fields }, dispatchProps, { id, ...restOwnProps }) {
  return {
    id,
    onSubmit: event => handleSubmit(event, id, fields),
    ...restOwnProps,
  };
}

function handleSubmit(event, id, fields) {
  event.preventDefault();
  const request = createRequest('GET', id, { ...fields });
  sendBackendRequest(request);
}
