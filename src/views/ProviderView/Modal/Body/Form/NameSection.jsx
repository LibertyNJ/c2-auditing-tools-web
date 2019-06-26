import React from 'react';

import FormRow from '../../../../../components/FormRow';
import Input from '../../../../../components/FormControl/Input';

NameSection.propTypes = {

};

NameSection.defaultProps = {

};

export default function NameSection(props) {
  return (
    <section>
      <h4 className="text-primary">Name</h4>
      <FormRow>
        <Input
          type="text"
          name="editLastName"
          value={props.editLastName}
          isDisabled={props.isSubmitted}
          label="Last"
          handleChange={props.handleChange}
          wrapperClassName="col-5"
        />
        <Input
          type="text"
          name="editFirstName"
          value={props.editFirstName}
          isDisabled={props.isSubmitted}
          label="First"
          handleChange={props.handleChange}
          wrapperClassName="col-5"
        />
        <Input
          type="text"
          name="editMiddleInitial"
          value={props.editMiddleInitial}
          label="MI"
          handleChange={props.handleChange}
          wrapperClassName="col-2"
        />
      </FormRow>
    </section>
  );
}
