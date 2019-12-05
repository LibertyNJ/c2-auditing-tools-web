import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Column from '../Column';
import FormRow from '../FormRow';
import FormIconButton from '../../redux/containers/FormIconButton';
import { createRequest } from '../../util';

const INITIAL_STATE = {
  c2ActivityReport: '',
  c2ActivityReportPath: '',
  medicationOrderTaskStatusDetailReport: '',
  medicationOrderTaskStatusDetailReportPath: '',
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default function Form({ children, id, ...restProps }) {
  const [state, setState] = useState(INITIAL_STATE);
  const handleChange = (event) => {
    const { files, name, value } = event.target;
    const pathName = `${name}Path`;
    const pathValue = files.length ? files[0].path : '';
    setState({ ...state, [name]: value, [pathName]: pathValue });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const request = createRequest('POST', 'data', { ...state });
  };
  const FormControlRows = React.Children.map(children, FormControl => (
    <FormRow>
      <Column>
        <FormControl.type
          form={id}
          onChange={handleChange}
          value={state[FormControl.props.name]}
          {...FormControl.props}
        />
      </Column>
    </FormRow>
  ));
  return (
    <form id={id} onSubmit={handleSubmit} {...restProps}>
      {FormControlRows}
      <FormRow>
        <Column>
          <FormIconButton
            className="btn-primary mb-3 ml-auto text-nowrap"
            form={id}
            icon="file-import"
            type="submit"
          >
            Import
          </FormIconButton>
        </Column>
      </FormRow>
    </form>
  );
}
