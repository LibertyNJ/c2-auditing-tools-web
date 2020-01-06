import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import FormInput from '../redux/containers/FormInput';

export default function LedgerView() {
  return (
    <React.Fragment>
      <SearchSection formId="ledger">
        <FormInput
          info="Required"
          label="Time start"
          max="9999-12-31T23:59"
          name="dateStart"
          required
          type="datetime-local"
        />
        <FormInput
          info="Required"
          label="Time end"
          max="9999-12-31T23:59"
          name="dateEnd"
          required
          type="datetime-local"
        />
        <FormInput label="Provider" name="provider" type="text" />
        <FormInput label="Product" name="product" type="text" />
        <FormInput label="Order ID" name="medicationOrderId" type="text" />
      </SearchSection>
      <RecordsSection
        columns={[
          { dataKey: 'providerName', label: 'Withdrawn by' },
          { dataKey: 'date', label: 'Time', maxWidth: 120 },
          { dataKey: 'product', label: 'Product' },
          { dataKey: 'amount', label: 'Amount', maxWidth: 110 },
          { dataKey: 'waste', label: 'Waste', maxWidth: 110 },
          { dataKey: 'dispositionType', label: 'Disposition', maxWidth: 130 },
          { dataKey: 'dispositionProviderName', label: 'Disposed by' },
          { dataKey: 'dispositionDate', label: 'Time', maxWidth: 120 },
          {
            dataKey: 'painReassessmentProviderName',
            label: 'Reassessed by',
            maxWidth: 150,
          },
          { dataKey: 'painReassessmentDate', label: 'Time', maxWidth: 120 },
          { dataKey: 'medicationOrderId', label: 'Order ID', maxWidth: 120 },
        ]}
        tableName="ledger"
      />
    </React.Fragment>
  );
}
