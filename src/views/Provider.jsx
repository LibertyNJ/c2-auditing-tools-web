import { ipcRenderer } from 'electron';
import React from 'react';

import Input from '../components/Input';
import RecordsTableSection from '../components/RecordsTableSection';
import SearchFormSection from '../components/SearchFormSection';

const formRef = React.createRef();

const ProviderView = () => {
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

  return (
    <React.Fragment>
      <div className="row flex-shrink-0">
        <header className="col">
          <h1 className="text-primary text-center">Providers</h1>
        </header>
      </div>
      <div className="row">
        <SearchForm ref={formRef} />
        <RecordsTableSection
          columnDefinitions={columnDefinitions}
          ipcChannel="provider"
          modalIsEnabled
          formRef={formRef}
        />
      </div>
    </React.Fragment>
  );
};

class SearchForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastName: '',
      firstName: '',
      middleInitial: '',
      adcId: '',
      emarId: '',
      isSubmitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value });
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    ipcRenderer.send('database', {
      header: {
        type: 'provider',
        response: 'provider',
      },

      body: {
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        middleInitial: this.state.middleInitial,
        adcId: this.state.adcId,
        emarId: this.state.emarId,
      },
    });

    if (event) {
      this.setState({ isSubmitted: true });

      ipcRenderer.once('provider', () => this.setState({ isSubmitted: false }));
    }
  }

  render() {
    return (
      <SearchFormSection
        isSubmitted={this.state.isSubmitted}
        handleSubmit={this.handleSubmit}
      >
        <Input
          type="text"
          name="lastName"
          value={this.state.lastName}
          label="Last name"
          handleChange={this.handleChange}
        />
        <Input
          type="text"
          name="firstName"
          value={this.state.firstName}
          label="First name"
          handleChange={this.handleChange}
        />
        <Input
          type="text"
          name="middleInitial"
          value={this.state.middleInitial}
          label="Middle initial"
          handleChange={this.handleChange}
        />
        <Input
          type="text"
          name="adcId"
          value={this.state.adcId}
          label="ADC ID"
          handleChange={this.handleChange}
        />
        <Input
          type="text"
          name="emarId"
          value={this.state.emarId}
          label="EMAR ID"
          handleChange={this.handleChange}
        />
      </SearchFormSection>
    );
  }
}

export default ProviderView;
