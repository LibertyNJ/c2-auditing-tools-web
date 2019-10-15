'use-strict';

import {
  CHANGE_PARAMETER,
  DISMISS_ERROR,
  QUERY_RECORDS,
  RECEIVE_RECORDS,
  RECEIVE_ERROR,
  SORT_RECORDS,
} from './types';

export function changeParameter(view, name, value) {
  return {
    name,
    type: CHANGE_PARAMETER,
    value,
    view,
  };
}

export function dismissError() {
  return {
    type: DISMISS_ERROR,
  };
}

export function queryRecords() {
  return {
    type: QUERY_RECORDS,
  };
}

export function receiveError(error) {
  return {
    error,
    type: RECEIVE_ERROR,
  };
}

export function receiveRecords(view, records) {
  return {
    records,
    type: RECEIVE_RECORDS,
    view,
  };
}

export function sortRecords(view, sortBy) {
  return {
    sortBy,
    type: SORT_RECORDS,
    view,
  };
}
