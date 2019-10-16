import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import Select from '../components/Select';
import ConnectedInput from '../redux/containers/ConnectedInput';

export default function TransactionsView() {
  return (
    <React.Fragment>
      <SearchSection view="transactions">
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
        <Select
          info="Required"
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
        <ConnectedInput label="Provider" name="provider" type="text" />
        <ConnectedInput label="Product" name="product" type="text" />
        <ConnectedInput label="Order ID" name="medicationOrderId" type="text" />
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
    </React.Fragment>
  );
}
