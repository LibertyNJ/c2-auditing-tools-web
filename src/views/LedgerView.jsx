import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import ConnectedInput from '../redux/containers/ConnectedInput';

export default function LedgerView() {
  return (
    <React.Fragment>
      <SearchSection view="ledger">
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
        <ConnectedInput label="Order ID" name="medicationOrderId" type="text" />
        <ConnectedInput label="Product" name="product" type="text" />
      </SearchSection>
      <RecordsSection
        channel="get-ledger"
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
        view="ledger"
      />
    </React.Fragment>
  );
}
