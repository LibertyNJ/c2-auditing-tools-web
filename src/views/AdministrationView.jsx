import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import ConnectedInput from '../redux/containers/ConnectedInput';

export default function AdministrationsView() {
  return (
    <React.Fragment>
      <SearchSection view="administrations">
        <ConnectedInput
          info="Required"
          label="Time start"
          max="9999-12-31T23:59"
          name="datetimeStart"
          required
          type="datetime-local"
        />
        <ConnectedInput
          info="Required"
          label="Time end"
          max="9999-12-31T23:59"
          name="datetimeEnd"
          required
          type="datetime-local"
        />
        <ConnectedInput label="Provider" name="provider" type="text" />
        <ConnectedInput label="Medication" name="medication" type="text" />
        <ConnectedInput label="Order ID" name="medicationOrderId" type="text" />
      </SearchSection>
      <RecordsSection
        channel="get-administrations"
        columns={[
          { dataKey: 'timestamp', label: 'Time', maxWidth: 120 },
          { dataKey: 'provider', label: 'Provider' },
          { dataKey: 'medication', label: 'Medication' },
          { dataKey: 'doseWithUnits', label: 'Dose', maxWidth: 100 },
          { dataKey: 'medicationOrderId', label: 'Order ID', maxWidth: 110 },
        ]}
      />
    </React.Fragment>
  );
}
