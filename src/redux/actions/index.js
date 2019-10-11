'use-strict';

import {
  CHANGE_FIELD, QUERY_DATA, RECEIVE_DATA, RECEIVE_ERROR, SORT_RECORDS,
} from './types';

export function changeField(view, name, value) {
  return {
    name,
    type: CHANGE_FIELD,
    value,
    view,
  };
}

export function queryData() {
  return {
    type: QUERY_DATA,
  };
}

export function receiveData(view, data) {
  return {
    data,
    type: RECEIVE_DATA,
    view,
  };
}

export function receiveError(error) {
  return {
    error,
    type: RECEIVE_ERROR,
  };
}

export function sortRecords(view, column) {
  return {
    column,
    type: SORT_RECORDS,
    view,
  };
}
