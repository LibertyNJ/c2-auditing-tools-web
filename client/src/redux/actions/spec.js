import {
  changeFormField,
  dismissError,
  queryData,
  receiveError,
  receiveFormData,
  receiveTableRecords,
  resetFormFields,
  sortTableRecords,
} from './index';
import {
  CHANGE_FORM_FIELD,
  DISMISS_ERROR,
  QUERY_DATA,
  RECEIVE_ERROR,
  RECEIVE_FORM_DATA,
  RECEIVE_TABLE_RECORDS,
  RESET_FORM_FIELDS,
  SORT_TABLE_RECORDS,
} from './types';

describe('changeFormField(form, name, value)', () => {
  test('Returns an object of type CHANGE_FORM_FIELD with correct properties.', () => {
    expect(changeFormField('foo', 'bar', 'baz')).toEqual({
      form: 'foo',
      name: 'bar',
      type: CHANGE_FORM_FIELD,
      value: 'baz',
    });
  });
});

describe('dismissError()', () => {
  test('Returns an object of type DISMISS_ERROR.', () => {
    expect(dismissError()).toEqual({
      type: DISMISS_ERROR,
    });
  });
});

describe('queryData()', () => {
  test('Returns an object of type QUERY_DATA.', () => {
    expect(queryData()).toEqual({
      type: QUERY_DATA,
    });
  });
});

describe('receiveError(error)', () => {
  test('Returns an object of type RECEIVE_ERROR with correct properties.', () => {
    expect(receiveError('foo')).toEqual({
      error: 'foo',
      type: RECEIVE_ERROR,
    });
  });
});

describe('receiveFormData(form, data)', () => {
  test('Returns an object of type RECEIVE_FORM_DATA with correct properties.', () => {
    expect(receiveFormData('foo', 'bar')).toEqual({
      data: 'bar',
      form: 'foo',
      type: RECEIVE_FORM_DATA,
    });
  });
});

describe('receiveTableRecords(table, records)', () => {
  test('Returns an object of type RECEIVE_TABLE_RECORDS with correct properties.', () => {
    expect(receiveTableRecords('foo', 'bar')).toEqual({
      records: 'bar',
      table: 'foo',
      type: RECEIVE_TABLE_RECORDS,
    });
  });
});

describe('resetFormFields(form)', () => {
  test('Returns an object of type RESET_FORM_FIELDS with correct properties.', () => {
    expect(resetFormFields('foo')).toEqual({
      form: 'foo',
      type: RESET_FORM_FIELDS,
    });
  });
});

describe('sortTableRecords(table, sortBy, sortDirection)', () => {
  test('Returns an object of type SORT_RECORDS with correct properties.', () => {
    expect(sortTableRecords('foo', 'bar', 'baz')).toEqual({
      sortBy: 'bar',
      sortDirection: 'baz',
      table: 'foo',
      type: SORT_TABLE_RECORDS,
    });
  });
});
