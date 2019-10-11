import React from 'react';

import Input from '../components/Input';
import RecordsSection from '../components/RecordsSection';
import Row from '../components/Row';
import SearchSection from '../components/SearchSection';
import View from '../components/View';

export default function LedgerView() {
  return (
    <View heading="Ledger">
      <Row className="flex-grow-1 flex-shrink-1">
        <SearchSection channel="get-ledger">
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
          <Input label="Product" name="product" type="text" />
          <Input label="Order ID" name="medicationOrderId" type="text" />
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
        />
      </Row>
    </View>
  );
}
