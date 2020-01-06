import { connect } from 'react-redux';

import { resetFormFields, getFormData } from '../actions';
import Form from '../../components/Form';

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Form);

function mapStateToProps(state) {
  return {
    fields: state.forms.editProvider.fields,
    providerId: state.forms.editProvider.data.providerId,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleSubmit: event => {
      event.preventDefault();
      dispatch(getFormData());
    },
    onReset: event => handleReset(event, dispatch, ownProps.id),
  };
}

function handleReset(event, dispatch, form) {
  event.preventDefault();
  dispatch(resetFormFields(form));
}

function mergeProps(
  { fields, providerId },
  { handleSubmit, ...restDispatchProps },
  { id, ...restOwnProps }
) {
  return {
    id,
    onSubmit: event => handleSubmit(event, providerId, fields),
    ...restDispatchProps,
    ...restOwnProps,
  };
}
