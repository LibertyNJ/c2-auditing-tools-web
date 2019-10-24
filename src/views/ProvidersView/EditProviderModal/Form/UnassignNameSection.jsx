import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isEmptyArray } from './utilities';
import Column from '../../../../components/Column';
import FormRow from '../../../../components/FormRow';
import FormSelect from '../../../../redux/containers/FormSelect';

UnassignNameSection.propTypes = {
  assignedProviderAdcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  assignedProviderEmars: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function UnassignNameSection({ assignedProviderAdcs, assignedProviderEmars }) {
  const adcNameOptions = assignedProviderAdcs.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));
  const emarNameOptions = assignedProviderEmars.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));
  return (
    <section>
      <h3>
        <FontAwesomeIcon color="red" icon="minus" /> Unassign names
      </h3>
      <FormRow>
        <Column>
          <section>
            <h4>ADC</h4>
            {!isEmptyArray(adcNameOptions) ? (
              <FormSelect form="editProvider" multiple name="providerAdcIdsToBeUnassigned">
                {adcNameOptions}
              </FormSelect>
            ) : (
              <div className="alert alert-info">No assigned ADC names found!</div>
            )}
          </section>
        </Column>
        <Column>
          <section>
            <h4>EMAR</h4>
            {!isEmptyArray(emarNameOptions) ? (
              <FormSelect form="editProvider" multiple name="providerEmarIdsToBeUnassigned">
                {emarNameOptions}
              </FormSelect>
            ) : (
              <div className="alert alert-info">No assigned EMAR names found!</div>
            )}
          </section>
        </Column>
      </FormRow>
    </section>
  );
}
