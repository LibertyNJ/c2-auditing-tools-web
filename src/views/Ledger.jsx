import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import ViewHeader from '../components/ViewHeader';

const LedgerView = () => {
  const formControlDefinitions = [
    {
      type: 'input',
      props: {
        type: 'datetime-local',
        name: 'datetimeStart',
        label: 'Time withdrawn start',
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
        label: 'Time withdrawn end',
        info: 'Required',
        attributes: {
          max: '9999-12-31T23:59',
          required: true,
        },
      },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'provider', label: 'Withdrawn by' },
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
      label: 'Withdrawn by',
      dataKey: 'provider',
      maxWidth: 0,
    },
    {
      label: 'Time',
      dataKey: 'timestamp',
      maxWidth: 120,
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
      label: 'Waste',
      dataKey: 'waste',
      maxWidth: 110,
    },
    {
      label: 'Disposition',
      dataKey: 'dispositionType',
      maxWidth: 130,
    },
    {
      label: 'Disposed by',
      dataKey: 'dispositionProvider',
      maxWidth: 0,
    },
    {
      label: 'Time',
      dataKey: 'dispositionTimestamp',
      maxWidth: 120,
    },

    {
      label: 'Pain reassessed',
      dataKey: 'painAssessmentTimestamp',
      maxWidth: 120,
    },
    {
      label: 'Pain reassessed by',
      dataKey: 'painAssessmentProvider',
      maxWidth: 0,
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
        <ViewHeader>Ledger</ViewHeader>
      </div>
      <div className="row flex-grow-1">
        <SearchSection
          formControlDefinitions={formControlDefinitions}
          ipcChannel="ledger"
        />
        <RecordsSection
          columnDefinitions={columnDefinitions}
          ipcChannel="ledger"
        />
      </div>
    </React.Fragment>
  );
};

export default LedgerView;
