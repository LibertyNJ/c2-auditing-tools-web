import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import ViewHeader from '../components/ViewHeader';

const TransactionView = () => {
  const transactionTypeOptions = [
    {
      value: 'Restock',
      text: 'Restock',
    },
    {
      value: 'Return',
      text: 'Return',
    },
    {
      value: 'Waste',
      text: 'Waste',
    },
    {
      value: 'Withdrawal',
      text: 'Withdrawal',
    },
  ];

  const formControlDefinitions = [
    {
      type: 'input',
      props: {
        type: 'datetime-local',
        name: 'datetimeStart',
        label: 'Time start',
        info: 'Required',
        attributes: {
          max: '9999-12-31T23:59',
          required: true,
        },
      },
    },
    {
      type: 'input',
      props: {
        type: 'datetime-local',
        name: 'datetimeEnd',
        label: 'Time end',
        info: 'Required',
        attributes: {
          max: '9999-12-31T23:59',
          required: true,
        },
      },
    },
    {
      type: 'select',
      props: {
        name: 'transactionTypes',
        label: 'Transaction types',
        options: transactionTypeOptions,
        info: 'Required, may select multiple options',
        attributes: {
          multiple: true,
          required: true,
        },
      },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'provider', label: 'Provider' },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'product', label: 'Product' },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'medicationOrderId', label: 'Order ID' },
    },
  ];

  const columnDefinitions = [
    {
      label: 'Time',
      dataKey: 'timestamp',
      maxWidth: 120,
    },
    {
      label: 'Provider',
      dataKey: 'provider',
      maxWidth: 0,
    },
    {
      label: 'Transaction',
      dataKey: 'transactionType',
      maxWidth: 130,
    },
    {
      label: 'Product',
      dataKey: 'product',
      maxWidth: 0,
    },
    {
      label: 'Amount',
      dataKey: 'amount',
      maxWidth: 110,
    },
    {
      label: 'Order ID',
      dataKey: 'medicationOrderId',
      maxWidth: 110,
    },
  ];

  return (
    <React.Fragment>
      <div className="row flex-shrink-0">
        <ViewHeader>Transaction</ViewHeader>
      </div>
      <div className="row flex-grow-1">
        <SearchSection
          formControlDefinitions={formControlDefinitions}
          ipcChannel="transaction"
        />
        <RecordsSection
          columnDefinitions={columnDefinitions}
          ipcChannel="transaction"
        />
      </div>
    </React.Fragment>
  );
};

export default TransactionView;
