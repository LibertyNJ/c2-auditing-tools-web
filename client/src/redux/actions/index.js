import axios from 'axios';

import {
  CHANGE_FORM_FIELD,
  DISMISS_ERROR,
  RECEIVE_FORM_DATA,
  RECEIVE_IMPORT_DATA_SUCCESS,
  RECEIVE_REQUEST_FORM_DATA_ERROR,
  RECEIVE_REQUEST_TABLE_RECORDS_ERROR,
  RECEIVE_TABLE_RECORDS,
  REQUEST_FORM_DATA,
  REQUEST_TABLE_RECORDS,
  RESET_FORM_FIELDS,
  SORT_TABLE_RECORDS,
} from './types';

export function changeFormField(form, name, value) {
  return {
    form,
    name,
    type: CHANGE_FORM_FIELD,
    value,
  };
}

export function dismissError() {
  return {
    type: DISMISS_ERROR,
  };
}

export function getFormData(form, parameters) {
  return async dispatch => {
    dispatch(requestFormData(form));

    try {
      const response = await axios.get(`http://localhost:8000/${form}`, {
        params: parameters,
      });

      const data = response.data;

      dispatch(receiveFormData(form, data));
    } catch (error) {
      console.error(error);
      dispatch(receiveRequestFormDataError(form, error));
    }
  };
}

export function getTableRecords(table, parameters) {
  return async dispatch => {
    dispatch(requestTableRecords(table));

    try {
      const response = await axios.get(`http://localhost:8000/${table}`, {
        params: parameters,
      });

      const records = response.data;

      dispatch(receiveTableRecords(table, records));
    } catch (error) {
      console.error(error);
      dispatch(receiveRequestTableRecordsError(table, error));
    }
  };
}

export function receiveRequestFormDataError(form, error) {
  return {
    error,
    form,
    type: RECEIVE_REQUEST_FORM_DATA_ERROR,
  };
}

export function receiveRequestTableRecordsError(table, error) {
  return {
    error,
    table,
    type: RECEIVE_REQUEST_TABLE_RECORDS_ERROR,
  };
}

export function receiveFormData(form, data) {
  return {
    data,
    form,
    type: RECEIVE_FORM_DATA,
  };
}

export function receiveImportDataSuccess() {
  return {
    type: RECEIVE_IMPORT_DATA_SUCCESS,
  };
}

export function receiveTableRecords(table, records) {
  return {
    records,
    table,
    type: RECEIVE_TABLE_RECORDS,
  };
}

export function requestFormData(form) {
  return {
    form,
    type: REQUEST_FORM_DATA,
  };
}

export function requestTableRecords(table) {
  return {
    table,
    type: REQUEST_TABLE_RECORDS,
  };
}

export function resetFormFields(form) {
  return {
    form,
    type: RESET_FORM_FIELDS,
  };
}

export function sortTableRecords(table, sortBy, sortDirection) {
  return {
    sortBy,
    sortDirection,
    table,
    type: SORT_TABLE_RECORDS,
  };
}
