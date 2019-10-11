import React from 'react';

import Input from '../components/Input';
import RecordsSection from '../components/RecordsSection';
import Row from '../components/Row';
import SearchSection from '../components/SearchSection';
import Select from '../components/Select';
import View from '../components/View';

export default function TransactionsView() {
  return (
    <View heading="Transactions">
      <Row className="flex-grow-1 flex-shrink-1">
        <SearchSection channel="get-transactions">
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
          <Select
            info="Required, may select multiple options"
            label="Transaction types"
            multiple
            name="transactionTypes"
            required
          >
            <option value="Restock">Restock</option>
            <option value="Return">Return</option>
            <option value="Waste">Waste</option>
            <option value="Withdrawal">Withdrawal</option>
          </Select>
          <Input label="Provider" name="provider" type="text" />
          <Input label="Product" name="product" type="text" />
          <Input label="Order ID" name="medicationOrderId" type="text" />
        </SearchSection>
        <RecordsSection
          channel="get-transactions"
          columns={[
            { dataKey: 'timestamp', label: 'Time', maxWidth: 120 },
            { dataKey: 'provider', label: 'Provider' },
            { dataKey: 'type', label: 'Transaction' },
            { dataKey: 'product', label: 'Product' },
            { dataKey: 'amount', label: 'Amount', maxWidth: 110 },
            { dataKey: 'medicationOrderId', label: 'Order ID', maxWidth: 110 },
          ]}
        />
      </Row>
    </View>
  );
}
