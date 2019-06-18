import React from 'react';

import RecordsSection from '../components/RecordsSection';
import SearchSection from '../components/SearchSection';
import ViewHeader from '../components/ViewHeader';

const ProviderView = () => {
  const formControlDefinitions = [
    {
      type: 'input',
      props: { type: 'text', name: 'lastName', label: 'Last name' },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'firstName', label: 'First name' },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'middleInitial', label: 'Middle initial' },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'adcId', label: 'ADC ID' },
    },
    {
      type: 'input',
      props: { type: 'text', name: 'emarId', label: 'EMAR ID' },
    },
  ];

  const columnDefinitions = [
    {
      label: 'Last name',
      dataKey: 'lastName',
      maxWidth: 0,
    },
    {
      label: 'First name',
      dataKey: 'firstName',
      maxWidth: 0,
    },
    {
      label: 'MI',
      dataKey: 'middleInitial',
      maxWidth: 70,
    },
    {
      label: 'ADC IDs',
      dataKey: 'adcId',
      maxWidth: 0,
    },
    {
      label: 'EMAR IDs',
      dataKey: 'emarId',
      maxWidth: 0,
    },
  ];

  const formRef = React.createRef();

  return (
    <React.Fragment>
      <div className="row flex-shrink-0">
        <ViewHeader>Provider</ViewHeader>
      </div>
      <div className="row flex-grow-1">
        <SearchSection
          formControlDefinitions={formControlDefinitions}
          ipcChannel="provider"
          ref={formRef}
        />
        <RecordsSection
          columnDefinitions={columnDefinitions}
          ipcChannel="provider"
          modalIsEnabled
          formRef={formRef}
        />
      </div>
    </React.Fragment>
  );
};

export default ProviderView;
