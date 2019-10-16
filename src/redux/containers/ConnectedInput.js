import { connect } from 'react-redux';

import { changeParameter } from '../actions';
import Input from '../../components/Input';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Input);

function mapStateToProps(state, ownProps) {
  return {
    value: getValue(state.views, ownProps.view, ownProps.name),
  };
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    onChange: event => handleChange(event, dispatch, ownProps.view),
  };
}

function getValue(views, viewName, parameterName) {
  return views[viewName].parameters[parameterName];
}

function handleChange(event, dispatch, view) {
  const { name, value } = event.target;
  dispatch(changeParameter(view, name, value));
}
