import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Column from '../../../../components/Column';
import FormRow from '../../../../components/FormRow';
import FormSelect from '../../../../redux/containers/FormSelect';

import { isEmptyArray } from './utilities';

AssignNameSection.propTypes = {
  unassignedProviderAdcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  unassignedProviderEmars: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function AssignNameSection({ unassignedProviderAdcs, unassignedProviderEmars }) {
  const adcNameOptions = unassignedProviderAdcs.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));
  const emarNameOptions = unassignedProviderEmars.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));
  return (
    <section>
      <h3>
        <FontAwesomeIcon color="green" icon="plus" /> Assign names
      </h3>
      <FormRow>
        <Column>
          <section>
            <h4>ADC</h4>
            {!isEmptyArray(adcNameOptions) ? (
              <FormSelect form="editProvider" multiple name="providerAdcIdsToBeAssigned">
                {adcNameOptions}
              </FormSelect>
            ) : (
              <div className="alert alert-info">No unassigned ADC names found!</div>
            )}
          </section>
        </Column>
        <Column>
          <section>
            <h4>EMAR</h4>
            {!isEmptyArray(emarNameOptions) ? (
              <FormSelect form="editProvider" multiple name="providerEmarIdsToBeAssigned">
                {emarNameOptions}
              </FormSelect>
            ) : (
              <div className="alert alert-info">No unassigned EMAR names found!</div>
            )}
          </section>
        </Column>
      </FormRow>
    </section>
  );
}
