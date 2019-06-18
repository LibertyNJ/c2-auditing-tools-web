import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import Input from './Input';
import Select from './Select';

export default class SearchFormSection extends React.Component {
  state = {
    isSubmitted: false,
  };

  static propTypes = {
    formControlDefinitions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        props: PropTypes.object.isRequired,
      })
    ).isRequired,
    ipcChannel: PropTypes.string.isRequired,
  };

  handleFormControlChange = ({ target }) => {
    if (SearchFormSection.isSelectFormControl(target)) {
      const values = SearchFormSection.getSelectedOptionValues(target);
      this.setState({ [target.name]: values });
    } else {
      this.setState({ [target.name]: target.value });
    }
  };

  static isSelectFormControl = formControl => formControl.tagName === 'SELECT';

  static getSelectedOptionValues = selectFormControl =>
    [...selectFormControl.selectedOptions].map(option => option.value);

  handleFormSubmit = event => {
    if (event) {
      event.preventDefault();
    }

    this.sendRequestToDatabase();
    this.setState({ isSubmitted: true });
    this.listenForDatabaseResponse();
  };

  sendRequestToDatabase = () => {
    ipcRenderer.send('database', {
      channel: this.props.ipcChannel,
      message: this.state,
    });
  };

  listenForDatabaseResponse = () => {
    ipcRenderer.once(this.props.ipcChannel, () =>
      this.setState({ isSubmitted: false })
    );
  };

  render = () => {
    const getFormControlElement = type => {
      switch (type) {
        case 'input':
          return Input;
        case 'select':
          return Select;
        default:
          throw new Error('Invalid form control type.');
      }
    };

    const formControls = this.props.formControlDefinitions.map(
      ({ type, props }, index) => {
        const FormControlElement = getFormControlElement(type);

        return (
          <FormControlElement
            key={index}
            value={this.state[props.name]}
            isDisabled={this.state.isSubmitted}
            handleChange={this.handleFormControlChange}
            {...props}
          />
        );
      }
    );

    return (
      <section className="col-3 d-flex flex-column">
        <header>
          <h2 className="text-primary">Search</h2>
        </header>
        <form
          className="form overflow-auto px-3 pb-3 ml-n3"
          onSubmit={this.handleFormSubmit}
        >
          {formControls}
          <Button
            type="submit"
            text="Search"
            icon="search"
            color="primary"
            disabled={this.state.isSubmitted}
            className="d-block ml-auto"
          />
        </form>
      </section>
    );
  };
}
