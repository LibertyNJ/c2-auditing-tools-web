import PropTypes from 'prop-types';
import React from 'react';

import FormRow from '../../../../components/FormRow';
import Select from '../../../../components/Select';
import SVGIcon from '../../../../components/SVGIcon';

import { isEmptyArray } from './utilities';

AssignNameSection.propTypes = {
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  providerAdcIdsToBeAssigned: PropTypes.arrayOf(PropTypes.string).isRequired,
  providerEmarIdsToBeAssigned: PropTypes.arrayOf(PropTypes.string).isRequired,
  unassignedProviderAdcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  unassignedProviderEmars: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AssignNameSection.defaultProps = {
  disabled: false,
};

export default function AssignNameSection({
  disabled,
  handleChange,
  providerAdcIdsToBeAssigned,
  providerEmarIdsToBeAssigned,
  unassignedProviderAdcs,
  unassignedProviderEmars,
}) {
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
      <h4>
        Assign names{' '}
        <SVGIcon className="align-baseline" fill="green" height="1em" type="plus" width="1em" />
      </h4>
      <FormRow>
        <section className="col">
          <h5>ADC</h5>
          {!isEmptyArray(adcNameOptions) ? (
            <Select
              disabled={disabled}
              handleChange={handleChange}
              multiple
              name="providerAdcIdsToBeAssigned"
              value={providerAdcIdsToBeAssigned}
            >
              {adcNameOptions}
            </Select>
          ) : (
            <div className="alert alert-info">No unassigned ADC names found!</div>
          )}
        </section>
        <section className="col">
          <h5>EMAR</h5>
          {!isEmptyArray(emarNameOptions) ? (
            <Select
              disabled={disabled}
              handleChange={handleChange}
              multiple
              name="providerEmarIdsToBeAssigned"
              value={providerEmarIdsToBeAssigned}
            >
              {emarNameOptions}
            </Select>
          ) : (
            <div className="alert alert-info">No unassigned EMAR names found!</div>
          )}
        </section>
      </FormRow>
    </section>
  );
}
