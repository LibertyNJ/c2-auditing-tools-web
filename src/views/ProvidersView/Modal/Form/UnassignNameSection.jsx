import PropTypes from 'prop-types';
import React from 'react';

import { isEmptyArray } from './utilities';
import FormRow from '../../../../components/FormRow';
import Select from '../../../../components/Select';
import SVGIcon from '../../../../components/SVGIcon';

UnassignNameSection.propTypes = {
  assignedProviderAdcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  assignedProviderEmars: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  providerAdcIdsToBeUnassigned: PropTypes.arrayOf(PropTypes.string).isRequired,
  providerEmarIdsToBeUnassigned: PropTypes.arrayOf(PropTypes.string).isRequired,
};

UnassignNameSection.defaultProps = {
  disabled: false,
};

export default function UnassignNameSection({
  assignedProviderAdcs,
  assignedProviderEmars,
  disabled,
  handleChange,
  providerAdcIdsToBeUnassigned,
  providerEmarIdsToBeUnassigned,
}) {
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
      <h4>
        Unassign names{' '}
        <SVGIcon className="align-baseline" fill="red" height="1em" type="minus" width="1em" />
      </h4>
      <FormRow>
        <section className="col">
          <h5>ADC</h5>
          {!isEmptyArray(adcNameOptions) ? (
            <Select
              disabled={disabled}
              handleChange={handleChange}
              multiple
              name="providerAdcIdsToBeUnassigned"
              value={providerAdcIdsToBeUnassigned}
            >
              {adcNameOptions}
            </Select>
          ) : (
            <div className="alert alert-info">No assigned ADC names found!</div>
          )}
        </section>
        <section className="col">
          <h5>EMAR</h5>
          {!isEmptyArray(emarNameOptions) ? (
            <Select
              disabled={disabled}
              handleChange={handleChange}
              multiple
              name="providerEmarIdsToBeUnassigned"
              value={providerEmarIdsToBeUnassigned}
            >
              {emarNameOptions}
            </Select>
          ) : (
            <div className="alert alert-info">No assigned EMAR names found!</div>
          )}
        </section>
      </FormRow>
    </section>
  );
}
