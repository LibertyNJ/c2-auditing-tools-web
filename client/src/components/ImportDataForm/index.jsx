import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Column from '../Column';
import FormRow from '../FormRow';
import FormIconButton from '../../redux/containers/FormIconButton';

const INITIAL_STATE = {
  c2ActivityReport: '',
  c2ActivityReportFile: null,
  c2ActivityReportPath: '',
  medicationOrderTaskStatusDetailReport: '',
  medicationOrderTaskStatusDetailReportFile: null,
  medicationOrderTaskStatusDetailReportPath: '',
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default function Form({ children, id, ...restProps }) {
  const [state, setState] = useState(INITIAL_STATE);

  const handleChange = event => {
    const { files, name, value } = event.target;
    const fileName = `${name}File`;
    const pathName = `${name}Path`;
    const pathValue = files.length ? files[0].path : '';

    setState({
      ...state,
      [fileName]: files[0],
      [name]: value,
      [pathName]: pathValue,
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('adcReport', state.c2ActivityReportFile);
    formData.append(
      'emarReport',
      state.medicationOrderTaskStatusDetailReportFile
    );

    try {
      axios.post('http://localhost:8000/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error(error);
    }
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
    <form
      encType="multipart/form-data"
      id={id}
      onSubmit={handleSubmit}
      {...restProps}
    >
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
