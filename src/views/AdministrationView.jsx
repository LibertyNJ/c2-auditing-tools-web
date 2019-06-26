import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import Header from '../components/Header';

const AdministrationView = () => {
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
      type: 'input',
      props: {
        type: 'text',
        name: 'provider',
        label: 'Provider',
      },
    },
    {
      type: 'input',
      props: {
        type: 'text',
        name: 'medication',
        label: 'Medication',
      },
    },
    {
      type: 'input',
      props: {
        type: 'text',
        name: 'medicationOrderId',
        label: 'Order ID',
      },
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
      label: 'Medication',
      dataKey: 'medication',
      maxWidth: 0,
    },
    {
      label: 'Dose',
      dataKey: 'dose',
      maxWidth: 100,
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
        <Header>Administration</Header>
      </div>
      <div className="row flex-grow-1">
        <SearchSection
          formControlDefinitions={formControlDefinitions}
          ipcChannel="administration"
        />
        <RecordsSection
          columnDefinitions={columnDefinitions}
          ipcChannel="administration"
        />
      </div>
    </React.Fragment>
  );
};

export default AdministrationView;
