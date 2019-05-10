import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import Input from './Input';
import Select from './Select';

class SearchFormSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;

    if (target.tagName === 'SELECT') {
      const values = [...target.selectedOptions].map(option => option.value);

      this.setState({ [target.name]: values });
    } else {
      this.setState({ [target.name]: target.value });
    }
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    ipcRenderer.send('database', {
      header: { type: this.props.ipcChannel, response: this.props.ipcChannel },
      body: this.state,
    });

    this.setState({ isSubmitted: true });
    ipcRenderer.once(this.props.ipcChannel, () =>
      this.setState({ isSubmitted: false })
    );
  }

  render() {
    const getElement = type => {
      switch (type) {
        case 'input':
          return Input;
        case 'select':
          return Select;
        default:
          return null;
      }
    };

    const formControls = this.props.formControlDefinitions.map(
      ({ type, props }, index) => {
        const Element = getElement(type);

        return (
          <Element
            key={index}
            value={this.state[props.name]}
            handleChange={this.handleChange}
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
          onSubmit={this.handleSubmit}
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
  }
}

SearchFormSection.propTypes = {
  ipcChannel: PropTypes.string.isRequired,
};

export default SearchFormSection;
