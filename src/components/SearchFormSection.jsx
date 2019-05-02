import PropTypes from 'prop-types';
import React from 'react';
import Button from './Button';

const SearchFormSection = props => (
  <section className="col-3 d-flex flex-column">
    <header>
      <h2 className="text-primary">Search</h2>
    </header>
    <form
      className="form overflow-auto px-3 pb-3 ml-n3"
      onSubmit={props.handleSubmit}
    >
      {props.children}
      <Button
        type="submit"
        text="Search"
        icon="search"
        color="primary"
        disabled={props.isSubmitted}
        className="d-block ml-auto"
      />
    </form>
  </section>
);

SearchFormSection.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default SearchFormSection;
