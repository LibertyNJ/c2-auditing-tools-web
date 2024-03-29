import { connect } from 'react-redux';

import { changeFormField } from '../actions';
import BootstrapSelect from '../../components/BootstrapSelect';

export default connect(mapStateToProps, mapDispatchToProps)(BootstrapSelect);

function mapStateToProps(state, ownProps) {
  return {
    disabled: isFormSubmitted(state.forms[ownProps.form]),
    value: getValue(state.forms, ownProps.form, ownProps.name),
  };
}

function isFormSubmitted(formState) {
  return formState.isSubmitted === true;
}

function getValue(forms, formName, fieldName) {
  return forms[formName].fields[fieldName];
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onChange: event => handleChange(event, dispatch, ownProps.form),
  };
}

function handleChange(event, dispatch, form) {
  const { name, selectedOptions } = event.target;
  const values = [...selectedOptions].map(
    selectedOption => selectedOption.value
  );
  dispatch(changeFormField(form, name, [...values]));
}
