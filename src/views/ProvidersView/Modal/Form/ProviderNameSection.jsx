import PropTypes from 'prop-types';
import React from 'react';

import FormRow from '../../../../components/FormRow';
import Input from '../../../../components/Input';

NameSection.propTypes = {
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  middleInitial: PropTypes.string,
};

NameSection.defaultProps = {
  disabled: false,
  firstName: '',
  lastName: '',
  middleInitial: '',
};

export default function NameSection({
  disabled,
  firstName,
  handleChange,
  lastName,
  middleInitial,
}) {
  return (
    <section>
      <h4>Name</h4>
      <FormRow>
        <Input
          disabled={disabled}
          handleChange={handleChange}
          label="Last"
          name="lastName"
          type="text"
          value={lastName}
          wrapperClassName="col-5"
        />
        <Input
          disabled={disabled}
          handleChange={handleChange}
          label="First"
          name="firstName"
          type="text"
          value={firstName}
          wrapperClassName="col-5"
        />
        <Input
          disabled={disabled}
          handleChange={handleChange}
          label="MI"
          maxLength={1}
          name="middleInitial"
          type="text"
          value={middleInitial}
          wrapperClassName="col-2"
        />
      </FormRow>
    </section>
  );
}
