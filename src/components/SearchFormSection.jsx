import PropTypes from 'prop-types';
import React from 'react';
import SVGIcon from './SVGIcon';

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
      <button className="btn btn-primary d-block ml-auto" type="submit">
        <SVGIcon
          className="align-baseline"
          type="search"
          width="1em"
          height="1em"
          fill="white"
        />{' '}
        Search
      </button>
    </form>
  </section>
);

SearchFormSection.propTypes = {
  children: PropTypes.node.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SearchFormSection;
