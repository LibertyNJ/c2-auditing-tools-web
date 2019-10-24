import { connect } from 'react-redux';

import ProviderNameDisplay from '../../views/ProvidersView/EditProviderModal/ProviderNameDisplay';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProviderNameDisplay);

function mapStateToProps(state) {
  return {
    firstName: state.forms.editProvider.data.firstName,
    lastName: state.forms.editProvider.data.lastName,
    middleInitial: state.forms.editProvider.data.middleInitial,
  };
}

function mapDispatchToProps() {
  return {};
}
