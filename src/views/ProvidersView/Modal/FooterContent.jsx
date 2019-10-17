import React from 'react';

import Button from '../../../components/Button';

export default function FooterContent() {
  return (
    <React.Fragment>
      <Button className="btn-primary" form="modal-form" iconType="save" type="submit">
        Save
      </Button>
      <Button className="btn-secondary" form="modal-form" iconType="undo" type="reset">
        Reset
      </Button>
    </React.Fragment>
  );
}
