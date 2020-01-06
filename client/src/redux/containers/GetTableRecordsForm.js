import { connect } from 'react-redux';

import Form from '../../components/Form';
import { requestTableRecords, getTableRecords } from '../actions';

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Form);

function mapStateToProps(state, ownProps) {
  return {
    parameters: state.forms[ownProps.id].fields,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleSubmit: (event, parameters) => {
      event.preventDefault();
      dispatch(getTableRecords(ownProps.id, parameters));
    },
  };
}

function mergeProps({ parameters }, { handleSubmit }, { ...restOwnProps }) {
  return {
    onSubmit: event => handleSubmit(event, parameters),
    ...restOwnProps,
  };
}
