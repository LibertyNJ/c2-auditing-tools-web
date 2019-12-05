import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import FormInput from '../redux/containers/FormInput';

export default function AdministrationsView() {
  return (
    <React.Fragment>
      <SearchSection formId="administrations">
        <FormInput
          info="Required"
          label="Time start"
          max="9999-12-31T23:59"
          name="datetimeStart"
          required
          type="datetime-local"
        />
        <FormInput
          info="Required"
          label="Time end"
          max="9999-12-31T23:59"
          name="datetimeEnd"
          required
          type="datetime-local"
        />
        <FormInput label="Provider" name="provider" type="text" />
        <FormInput label="Medication" name="medication" type="text" />
        <FormInput label="Order ID" name="medicationOrderId" type="text" />
      </SearchSection>
      <RecordsSection
        columns={[
          { dataKey: 'timestamp', label: 'Time', maxWidth: 120 },
          { dataKey: 'provider', label: 'Provider' },
          { dataKey: 'medicationWithForm', label: 'Medication' },
          { dataKey: 'doseWithUnits', label: 'Dose', maxWidth: 100 },
          { dataKey: 'medicationOrderId', label: 'Order ID', maxWidth: 120 },
        ]}
        tableName="administrations"
      />
    </React.Fragment>
  );
}
