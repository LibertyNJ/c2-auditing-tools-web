import { connect } from 'react-redux';

import { changeFormField } from '../actions';
import FileInput from '../../components/FileInput';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileInput);

function mapStateToProps(state, ownProps) {
  return {
    disabled: !isDatabaseReady(state.databaseStatus),
    value: getValue(state.forms, ownProps.form, ownProps.name),
  };
}

function isDatabaseReady(databaseStatus) {
  return databaseStatus === 'Ready';
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
  const { files, name, value } = event.target;
  const pathName = `${name}Path`;
  const pathValue = files[0].path;
  dispatch(changeFormField(form, name, value));
  dispatch(changeFormField(form, pathName, pathValue));
}
