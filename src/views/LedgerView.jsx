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
        <FormInput label="Product" name="product" type="text" />
        <FormInput label="Order ID" name="medicationOrderId" type="text" />
      </SearchSection>
      <RecordsSection
        columns={[
          { dataKey: 'provider', label: 'Withdrawn by' },
          { dataKey: 'timestamp', label: 'Time', maxWidth: 120 },
          { dataKey: 'product', label: 'Product' },
          { dataKey: 'amount', label: 'Amount', maxWidth: 110 },
          { dataKey: 'waste', label: 'Waste', maxWidth: 110 },
          { dataKey: 'dispositionType', label: 'Disposition', maxWidth: 130 },
          { dataKey: 'dispositionProvider', label: 'Disposed by' },
          { dataKey: 'dispositionTimestamp', label: 'Time', maxWidth: 120 },
          { dataKey: 'painReassessmentTimestamp', label: 'Pain reassessed' },
          { dataKey: 'painReassessmentProvider', label: 'Pain reassessed by', maxWidth: 110 },
          { dataKey: 'medicationOrderId', label: 'Order ID', maxWidth: 110 },
        ]}
        tableName="ledger"
      />
    </React.Fragment>
  );
}
