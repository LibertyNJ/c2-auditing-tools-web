import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import FormInput from '../redux/containers/FormInput';
import FormSelect from '../redux/containers/FormSelect';

export default function TransactionsView() {
  return (
    <React.Fragment>
      <SearchSection formId="transactions">
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
        <FormSelect
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
        </FormSelect>
        <FormInput label="Provider" name="provider" type="text" />
        <FormInput label="Product" name="product" type="text" />
        <FormInput label="Order ID" name="medicationOrderId" type="text" />
      </SearchSection>
      <RecordsSection
        columns={[
          { dataKey: 'timestamp', label: 'Time', maxWidth: 120 },
          { dataKey: 'provider', label: 'Provider' },
          { dataKey: 'type', label: 'Transaction' },
          { dataKey: 'product', label: 'Product' },
          { dataKey: 'amount', label: 'Amount', maxWidth: 110 },
          { dataKey: 'medicationOrderId', label: 'Order ID', maxWidth: 120 },
        ]}
        tableName="transactions"
      />
    </React.Fragment>
  );
}
