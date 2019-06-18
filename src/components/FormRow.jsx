import PropTypes from 'prop-types';
import React from 'react';

const FormRow = ({ children }) => <div className="form-row">{children}</div>;

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormRow;
