import { ipcRenderer } from 'electron';
import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import FormControl from '../FormControl';

export default class Form extends React.Component {
  state = { isSubmitted: false };

  static propTypes = {
    formControlDefinitions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        props: PropTypes.object.isRequired,
      }),
    ).isRequired,
    ipcChannel: PropTypes.string.isRequired,
  };

  handleChange = ({ target }) => {
    if (Form.isSelectElement(target)) {
      const values = Form.getSelectedOptionValues(target);
      this.setState({ [target.name]: values });
    } else {
      this.setState({ [target.name]: target.value });
    }
  };

  static isSelectElement = element => element.tagName === 'SELECT';

  static getSelectedOptionValues = (selectElement) => {
    const selectedOptions = [...selectElement.selectedOptions];
    const selectedOptionValues = selectedOptions.map(option => option.value);
    return selectedOptionValues;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendRequestToDatabase();
    this.toggleFormIsSubmitted();
    this.listenForDatabaseResponse();
  };

  sendRequestToDatabase = () => {
    ipcRenderer.send('database', {
      channel: this.props.ipcChannel,
      message: this.state,
    });
  };

  toggleFormIsSubmitted = () => {
    this.setState(state => ({ isSubmitted: !state.isSubmitted }));
  };

  listenForDatabaseResponse = () => {
    ipcRenderer.once(this.props.ipcChannel, () => this.toggleFormIsSubmitted());
  };

  render = () => {
    const formControls = this.props.formControlDefinitions.map(({ type, props }) => (
      <FormControl
        key={props.name}
        formControlType={type}
        value={this.state[props.name]}
        isDisabled={this.state.isSubmitted}
        handleChange={this.handleChange}
        {...props}
      />
    ));

    return (
      <form className="form overflow-auto px-3 pb-3 ml-n3" onSubmit={this.handleSubmit}>
        {formControls}
        <Button
          type="submit"
          text="Search"
          iconType="search"
          color="primary"
          disabled={this.state.isSubmitted}
          className="d-block ml-auto"
        />
      </form>
    );
  };
}
