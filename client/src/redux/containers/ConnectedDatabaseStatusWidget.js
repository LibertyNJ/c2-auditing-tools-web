import { connect } from 'react-redux';

import DatabaseStatusWidget from '../../components/Layout/Footer/DatabaseStatusWidget';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DatabaseStatusWidget);

function mapStateToProps(state) {
  return {
    databaseStatus: state.databaseStatus,
  };
}

function mapDispatchToProps() {
  return {};
}
