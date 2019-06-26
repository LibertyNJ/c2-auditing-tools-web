import React from 'react';

import Button from '../../../components/Button';

export default function Footer() {
  return (
    <footer className="modal-footer">
      <Button
        type="submit"
        form="modal-form"
        text="Save"
        color="primary"
        iconType="save"
      />
      <Button
        type="reset"
        form="modal-form"
        text="Reset"
        color="secondary"
        iconType="undo"
      />
    </footer>
  );
}
