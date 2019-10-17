import { connect } from 'react-redux';

import { changeParameter } from '../actions';
import Select from '../../components/Select';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Select);

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
  const { name, selectedOptions } = event.target;
  const values = [...selectedOptions].map(selectedOption => selectedOption.value);
  dispatch(changeParameter(view, name, values));
}
