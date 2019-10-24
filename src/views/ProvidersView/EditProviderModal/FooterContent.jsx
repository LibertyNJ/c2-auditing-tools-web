import React from 'react';
import FormIconButton from '../../../redux/containers/FormIconButton';

export default function FooterContent() {
  return (
    <React.Fragment>
      <FormIconButton
        className="btn-primary text-nowrap"
        form="editProvider"
        icon="save"
        type="submit"
      >
        Save
      </FormIconButton>
      <FormIconButton
        className="btn-secondary text-nowrap"
        form="editProvider"
        icon="undo"
        type="reset"
      >
        Reset
      </FormIconButton>
    </React.Fragment>
  );
}
