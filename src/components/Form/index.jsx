import PropTypes from 'prop-types';
import React from 'react';

import { ipcRenderer } from 'electron';

import Button from '../Button';

import { getSelectedOptionValues, isSelectElement } from './utilities';

export default class Form extends React.Component {
  static propTypes = {
    channel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    initialState: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.string]),
    ),
  };

  static defaultProps = {
    className: null,
    initialState: {},
  };

  state = { isSubmitted: false };

  componentDidMount = () => {
    this.setInitialState();
  };

  setInitialState = () => {
    this.initialState = { ...this.props.initialState };
  };

  componentWillUnmount = () => {
    this.stopListeningForBackendCommunication();
  };

  stopListeningForBackendCommunication = () => {
    ipcRenderer.removeAllListeners(this.props.channel);
  };

  handleChange = ({ target }) => {
    if (isSelectElement(target)) {
      this.setSelectControlState(target);
    } else {
      this.setOtherControlState(target);
    }
  };

  setSelectControlState = (target) => {
    const values = getSelectedOptionValues(target);
    this.setState({ [target.name]: values });
  };

  setOtherControlState = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  handleReset = (event) => {
    event.preventDefault();
    this.restoreInitialState();
  };

  restoreInitialState = () => {
    this.setState({ ...this.initialState });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.toggleIsSubmitted();
    this.listenForBackendResponse();
    this.sendMessageToBackend();
  };

  sendMessageToBackend = () => {
    ipcRenderer.send('backend', {
      body: this.state,
      channel: this.props.channel,
    });
  };

  listenForBackendResponse = () => {
    ipcRenderer.once(this.props.channel, this.toggleIsSubmitted);
  };

  toggleIsSubmitted = () => {
    this.setState(state => ({ isSubmitted: !state.isSubmitted }));
  };

  render = () => {
    const formControls = React.Children.map(
      this.props.children,
      this.cloneFormControlWithStateAndHandlers,
    );

    return (
      <form
        className={this.props.className}
        onReset={this.handleReset}
        onSubmit={this.handleSubmit}
      >
        {formControls}
        <Button
          className="btn-primary d-block ml-auto mb-3"
          disabled={this.state.isSubmitted}
          iconType="search"
          type="submit"
        >
          Search
        </Button>
      </form>
    );
  };

  cloneFormControlWithStateAndHandlers = FormControl => React.cloneElement(FormControl, {
    disabled: this.state.isSubmitted,
    handleChange: this.handleChange,
    value: this.state[FormControl.props.name],
  });
}
