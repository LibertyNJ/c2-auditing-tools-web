import { connect } from 'react-redux';

import { resetFormFields } from '../actions';
import Form from '../../components/Form';
import { createRequest, sendBackendRequest } from '../../util';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Form);

function mapStateToProps(state) {
  return {
    fields: state.forms.editProvider.fields,
    providerId: state.forms.editProvider.data.providerId,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onReset: event => handleReset(event, dispatch, ownProps.id),
  };
}

function handleReset(event, dispatch, form) {
  event.preventDefault();
  dispatch(resetFormFields(form));
}

function mergeProps({ fields, providerId }, dispatchProps, { id, ...restOwnProps }) {
  return {
    ...dispatchProps,
    id,
    onSubmit: event => handleSubmit(event, providerId, fields),
    ...restOwnProps,
  };
}

function handleSubmit(event, providerId, fields) {
  event.preventDefault();
  const request = createRequest('PUT', 'provider', { providerId, ...fields });
  sendBackendRequest(request);
}
