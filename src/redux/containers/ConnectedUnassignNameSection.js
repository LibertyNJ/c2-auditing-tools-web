import { connect } from 'react-redux';

import UnassignNameSection from '../../views/ProvidersView/EditProviderModal/Form/UnassignNameSection';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnassignNameSection);

function mapStateToProps(state) {
  return {
    assignedProviderAdcs: state.forms.editProvider.data.assignedProviderAdcs,
    assignedProviderEmars: state.forms.editProvider.data.assignedProviderEmars,
  };
}

function mapDispatchToProps() {
  return {};
}
