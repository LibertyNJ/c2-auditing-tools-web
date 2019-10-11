import React from 'react';

import Input from '../components/Input';
import RecordsSection from '../components/RecordsSection';
import Row from '../components/Row';
import SearchSection from '../components/SearchSection';
import View from '../components/View';

export default function AdministrationsView() {
  return (
    <View heading="Administrations">
      <Row className="flex-grow-1 flex-shrink-1">
        <SearchSection channel="get-administrations">
          <Input
            info="Required"
            label="Time start"
            max="9999-12-31T23:59"
            name="datetimeStart"
            required
            type="datetime-local"
          />
          <Input
            info="Required"
            label="Time end"
            max="9999-12-31T23:59"
            name="datetimeEnd"
            required
            type="datetime-local"
          />
          <Input label="Provider" name="provider" type="text" />
          <Input label="Medication" name="medication" type="text" />
          <Input label="Order ID" name="medicationOrderId" type="text" />
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
      </Row>
    </View>
  );
}
