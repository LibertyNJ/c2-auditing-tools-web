import PropTypes from 'prop-types';
import React from 'react';

Form.propTypes = {
  children: PropTypes.node,
};

export default function Form({ children, ...restProps }) {
  return <form {...restProps}>{children}</form>;
}
