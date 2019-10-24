import {
  CHANGE_FORM_FIELD,
  DISMISS_ERROR,
  RECEIVE_DATABASE_STATUS,
  RECEIVE_ERROR,
  RECEIVE_FORM_DATA,
  RECEIVE_IMPORT_DATA_SUCCESS,
  RECEIVE_TABLE_RECORDS,
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

export function receiveDatabaseStatus(status) {
  return {
    status,
    type: RECEIVE_DATABASE_STATUS,
  };
}

export function receiveError(error) {
  return {
    error,
    type: RECEIVE_ERROR,
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
