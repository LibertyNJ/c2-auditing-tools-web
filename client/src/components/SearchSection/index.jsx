import PropTypes from 'prop-types';
import React from 'react';

import FormRow from '../FormRow';
import Column from '../Column';
import FormIconButton from '../../redux/containers/FormIconButton';
import GetTableRecordsForm from '../../redux/containers/GetTableRecordsForm';

SearchSection.propTypes = {
  children: PropTypes.node.isRequired,
  formId: PropTypes.string.isRequired,
};

export default function SearchSection({ children, formId, ...restProps }) {
  const FormControlColumns = React.Children.map(children, FormControl => (
    <Column>
      <FormControl.type {...FormControl.props} form={formId} />
    </Column>
  ));
  return (
    <section {...restProps}>
      <GetTableRecordsForm id={formId}>
        <FormRow className="flex-nowrap">
          {FormControlColumns}
          <Column className="flex-grow-0">
            <FormIconButton
              className="btn-primary text-nowrap"
              icon="search"
              style={{ marginTop: '32px' }}
            >
              Search
            </FormIconButton>
          </Column>
        </FormRow>
      </GetTableRecordsForm>
    </section>
  );
}
