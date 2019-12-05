import { connect } from 'react-redux';

import FileInput from '../../components/FileInput';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileInput);

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
