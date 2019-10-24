import { connect } from 'react-redux';

import IconButton from '../../components/IconButton';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IconButton);

function mapStateToProps(state) {
  return {
    disabled: !isDatabaseReady(state.databaseStatus),
  };
}

function isDatabaseReady(databaseStatus) {
  return databaseStatus === 'Ready';
}

function mapDispatchToProps() {
  return {};
}
