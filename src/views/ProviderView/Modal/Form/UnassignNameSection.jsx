import React from 'react';
import PropTypes from 'prop-types';

import FormRow from '../../../../components/FormRow';
import Section from '../../../../components/Section';
import Select from '../../../../components/Select';
import SVGIcon from '../../../../components/SVGIcon';

import { isEmptyArray } from './utilities';

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
  const SectionHeading = (
    <React.Fragment>
      Unassign names{' '}
      <SVGIcon className="align-baseline" fill="red" height="1em" type="minus" width="1em" />
    </React.Fragment>
  );

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
    <Section heading={SectionHeading} level={4}>
      <FormRow>
        <Section className="col" heading="ADC" level={5}>
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
        </Section>
        <Section className="col" heading="EMAR" level={5}>
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
        </Section>
      </FormRow>
    </Section>
  );
}
