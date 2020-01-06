import { connect } from 'react-redux';

import FileInput from '../../components/FileInput';

export default connect(mapStateToProps, mapDispatchToProps)(FileInput);

function mapStateToProps(state, ownProps) {
  return {
    disabled: isFormSubmitted(state.forms[ownProps.form]),
  };
}

function isFormSubmitted(formState) {
  return formState.isSubmitted === true;
}

function mapDispatchToProps() {
  return {};
}
