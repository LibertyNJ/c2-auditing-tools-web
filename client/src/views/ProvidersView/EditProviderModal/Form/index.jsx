import React from 'react';

import ProviderNameSection from './ProviderNameSection';
import ConnectedAssignNameSection from '../../../../redux/containers/ConnectedAssignNameSection';
import ConnectedUnassignNameSection from '../../../../redux/containers/ConnectedUnassignNameSection';
import EditProviderForm from '../../../../redux/containers/EditProviderForm';

export default function Form({ ...restProps }) {
  return (
    <React.Fragment>
      <EditProviderForm id="editProvider" {...restProps}>
        <ProviderNameSection />
        <ConnectedAssignNameSection />
        <ConnectedUnassignNameSection />
      </EditProviderForm>
    </React.Fragment>
  );
}
