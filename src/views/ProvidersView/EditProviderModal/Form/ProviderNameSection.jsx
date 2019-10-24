import React from 'react';

import Column from '../../../../components/Column';
import FormRow from '../../../../components/FormRow';
import FormInput from '../../../../redux/containers/FormInput';

export default function NameSection({ ...restProps }) {
  return (
    <section {...restProps}>
      <h3>Name</h3>
      <FormRow>
        <Column span={5}>
          <FormInput form="editProvider" label="Last" name="lastName" type="text" />
        </Column>
        <Column span={5}>
          <FormInput form="editProvider" label="First" name="firstName" type="text" />
        </Column>
        <Column span={2}>
          <FormInput
            form="editProvider"
            label="MI"
            maxLength={1}
            name="middleInitial"
            type="text"
          />
        </Column>
      </FormRow>
    </section>
  );
}
