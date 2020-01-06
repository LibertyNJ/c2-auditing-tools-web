import { connect } from 'react-redux';

import IconButton from '../../components/IconButton';

export default connect(mapStateToProps, mapDispatchToProps)(IconButton);

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
