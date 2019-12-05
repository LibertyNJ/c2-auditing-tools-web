import React from 'react';

import EditProviderModal from './EditProviderModal';
import { showModal } from '../../components/Modal';
import RecordsSection from '../../components/RecordsSection';
import SearchSection from '../../components/SearchSection';
import FormInput from '../../redux/containers/FormInput';
import { createRequest } from '../../util';

export default function ProvidersView() {
  return (
    <React.Fragment>
      <SearchSection formId="providers">
        <FormInput label="Last name" name="lastName" type="text" />
        <FormInput label="First name" name="firstName" type="text" />
        <FormInput label="Middle initial" name="middleInitial" type="text" />
        <FormInput label="ADC name" name="adcName" type="text" />
        <FormInput label="EMAR name" name="emarName" type="text" />
      </SearchSection>
      <RecordsSection
        columns={[
          { dataKey: 'lastName', label: 'Last name' },
          { dataKey: 'firstName', label: 'First name' },
          { dataKey: 'middleInitial', label: 'MI', maxWidth: 70 },
          { dataKey: 'adcIds', label: 'ADC names' },
          { dataKey: 'emarIds', label: 'EMAR names' },
        ]}
        onRowClick={handleRowClick}
        tableName="providers"
      />
      <EditProviderModal />
    </React.Fragment>
  );
}

function handleRowClick({ rowData }) {
  const providerId = rowData.id;
  const request = createRequest('GET', 'edit-provider', providerId);
  showModal();
}
