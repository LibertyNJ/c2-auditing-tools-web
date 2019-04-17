import IconButton from './IconButton';
import PropTypes from 'prop-types';
import React from 'react';

const SearchFormSection = props => (
  <section className="col-3 d-flex flex-column">
    <header>
      <h2>Search</h2>
    </header>
    <form
      className="form overflow-auto px-3 pb-3 ml-n3"
      onSubmit={props.handleSubmit}
    >
      {props.children}
      <IconButton
        type="submit"
        text="Search"
        color="primary"
        icon="search"
        className="d-block ml-auto"
      />
    </form>
  </section>
);

SearchFormSection.propTypes = {
  children: PropTypes.node.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SearchFormSection;
