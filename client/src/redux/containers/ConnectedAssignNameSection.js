import { connect } from 'react-redux';

import AssignNameSection from '../../views/ProvidersView/EditProviderModal/Form/AssignNameSection';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssignNameSection);

function mapStateToProps(state) {
  return {
    unassignedProviderAdcs: state.forms.editProvider.data.unassignedProviderAdcs,
    unassignedProviderEmars: state.forms.editProvider.data.unassignedProviderEmars,
  };
}

function mapDispatchToProps() {
  return {};
}
