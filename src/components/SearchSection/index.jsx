import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FormRow from '../FormRow';
import Column from '../Column';

SearchSection.propTypes = {
  children: PropTypes.node.isRequired,
  view: PropTypes.string.isRequired,
};

export default function SearchSection({ children, view, ...restProps }) {
  const FormControlColumns = React.Children.map(children, FormControl => (
    <Column>
      <FormControl.type {...FormControl.props} view={view} />
    </Column>
  ));
  return (
    <section {...restProps}>
      <form>
        <FormRow className="flex-nowrap">
          {FormControlColumns}
          <Column className="flex-grow-0">
            <button className="btn btn-primary d-block text-nowrap" style={{ marginTop: '32px' }}>
              <FontAwesomeIcon icon="search" /> Search
            </button>
          </Column>
        </FormRow>
      </form>
    </section>
  );
}
