import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';

const ModalFooter = ({ isSubmitted }) => (
  <footer className="modal-footer">
    <Button
      type="submit"
      text="Save"
      color="primary"
      icon="save"
      disabled={isSubmitted}
    />
    <Button
      type="reset"
      text="Reset"
      color="secondary"
      icon="undo"
      disabled={isSubmitted}
    />
  </footer>
);

ModalFooter.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
};

export default ModalFooter;
