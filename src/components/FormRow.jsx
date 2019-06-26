import React from 'react';
import PropTypes from 'prop-types';

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function FormRow({ children }) {
  return <div className="form-row">{children}</div>;
}
